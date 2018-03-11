<?php

  class Fakeometer {
    // This is a useful place to look if things seem off
    public $log_text = array();

    /**
     * Looks up a site (either using a URL or a domain name) and returns the
     * Real/Fake score. Lower numbers are faker. 100 is a solid cutoff point,
     * but the 75 range may be a little more forgiving on fuzzy matches.
     * @param string $url The URL or domain name to look up
     * @return float The Real/Fake score, or 0 on some sort of error
     */
    public function lookup($url) {
      // Find all MX records for this site
      $mx = $this->find_mx($url);

      if (count($mx) > 0) {
        // Found at least one; score it
        return $this->score_mx($mx);
      } else {
        // No records; can't score anything
        return 0;
      }
    }

    /**
     * TODO docs
     */
    private function find_mx($url) {
      $this->debug_log("User input: $url");

      // Interpret the input as a URL, then extract the hostname from it
      if (preg_match('/^[^:]+:\/\//', $url) !== 1) {
        $url = 'https://' . $url;
      }
      $hostname = parse_url($url, PHP_URL_HOST);

      do {
        $this->debug_log("Considering domain part: $hostname");

        // Look up the MX record(s), and return the first ones found
        $mx = dns_get_record($hostname, DNS_MX);
        $count = count($mx);
        if ($count > 0) {
          // Found it
          $this->debug_log("Number of MX records found: $count");
          return $mx;
        }

        // Cut subdomain off the left-hand side until only 'domain.com' remains
        $hostname = preg_replace('/^[^\.]+\./', '', $hostname);
      } while (substr_count($hostname, '.') > 0);

      $this->debug_log("Could not find any MX records.");
      return array();
    }

    /**
     * TODO docs
     */
    private function score_mx($mx) {
      // Array to save the score list in
      $scores = array(0);

      // Loop over each supplied MX record
      foreach ($mx as $record) {
        // Grab the host/target fields from this record, and convert hostnames
        // like 'some.host.domain.com' to ['some', 'host', 'domain', 'com'].
        $host = explode('.', $record['host']);
        $targ = explode('.', $record['target']);

        // Incrementally compare and weigh the domain components. A TLD is worth
        // 10, a domain name 100, a hostname 1000, etc.
        $score = 0;
        $i = 0;
        while (count($host) > 0) {
          // Compare 'com' to 'com', 'domain' to 'domain', and so forth
          $host_part = strtolower(array_pop($host));
          $targ_part = strtolower(array_pop($targ));

          if ($host_part == $targ_part) {
            // This part matches exactly
            $score += pow(10, ++$i);
          } else {
            // Doesn't match; assign a fractional score based on fuzzy matching
            $score += pow(10, ++$i) * $this->fuzzy_cmp($host_part, $targ_part);
          }
        }

        // Stash the overall score for this MX record's names
        $this->debug_log("{$record['host']} vs. {$record['target']}: $score");
        $scores[] = $score;
      }

      // Find the single best score from all the MX records
      $best = max($scores);
      $this->debug_log("Best score: $best");
      return $best;
    }

    /**
     * TODO docs
     */
    private function fuzzy_cmp($string1, $string2) {
      // Length difference between the two supplied strings
      $diff = strlen($string1) - strlen($string2);

      // Find which string is longer and which is shorter
      if ($diff >= 0) {
        $lstring = $string1;
        $sstring = $string2;
      } else {
        $lstring = $string2;
        $sstring = $string1;
        $diff = -$diff;
      }
      $len = strlen($sstring);

      // Compare the strings to each other
      $scores = array(0);
      for ($i = 0; $i <= $diff; $i++) {
        // Try each alignment of the short string relative to the long one
        $score = 0;
        for ($j = 0; $j < $len; $j++) {
          // Compare character-by-character; each match is worth one point
          if ($sstring[$j] == $lstring[$j + $i]) {
            $score++;
          }
        }
        $scores[] = $score;
      }

      // Return the best score out of all the alignments
      return max($scores) / $len;
    }

    /**
     * TODO docs
     */
    private function debug_log($message) {
      // Adds a message to the object's debug log
      $this->log_text[] = $message;
    }
  }

?>
