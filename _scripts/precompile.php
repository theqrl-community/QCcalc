<?php
// Requirements: linux, octave 5 installed via flatpak

// Overall load multiplies by the total threads in your system
// to get your ideal load. Good for doing other things while compiling.
$overall_load = 0.5;

// 0 to go by overall_load, otherwise set number of threads
// Should be renamed by processes to be more accurate.
$threads=12; 

// Different configuration values
$y_increaseInQubits = range(25, 200, 25);
$y_algorithmicImprovement = range(25, 200, 25);
$y_errorRateImprovement = range(25, 200, 25);
$runTime = [24,(24*7),(24*7*4),(24*7*26)];
$uncertainty = range(25,100,25);
$samples = 2500;

// Count processes with name...
function count_processes() {
	$number = exec("ps aux --no-heading | grep -i octave-cli | wc -l");
	$number -= 2;
	return $number;
}

$ncpu = 2;

if(is_file('/proc/cpuinfo')) {
    $cpuinfo = file_get_contents('/proc/cpuinfo');
    preg_match_all('/^processor/m', $cpuinfo, $matches);
    $ncpu = count($matches[0]);
}

if($threads!=0) {
	$ncpu_load=$threads;
} else {
	$ncpu_load=ceil($ncpu * $overall_load);
}

echo "Maximum processes: ". $ncpu_load."\n";

// Get a count of files...
$total_files = count($y_increaseInQubits)*count($y_algorithmicImprovement)*count($y_errorRateImprovement)*count($runTime)*count($uncertainty);

echo "Total files to be created: ".$total_files."\n";

$file_counter=0;
$time_start = microtime(true); 
$est_sleep = 0.5;

foreach ($y_increaseInQubits as $y_increaseInQubits_value) { 
	foreach ($y_algorithmicImprovement as $y_algorithmicImprovement_value) { 
		foreach ($y_errorRateImprovement as $y_errorRateImprovement_value) { 
			foreach ($uncertainty as  $uncertainty_value) { 

				foreach ($runTime as $runTime_value) {
					$whilecount=1;
					# code...
					while(count_processes() >= $ncpu_load) {
						print count_processes()." threads of a total system max load of ".$ncpu_load." threads occupied. Waiting.\n";
						sleep(ceil($est_sleep+$whilecount));
						$whilecount=$whilecount*1.1;
					}

					// sleep(1);
					shell_exec("flatpak run org.octave.Octave -Wq QCcalc.m $y_increaseInQubits_value $y_algorithmicImprovement_value $y_errorRateImprovement_value $uncertainty_value $runTime_value $samples > /dev/null &");
					$file_counter++;


					if($file_counter % ($ncpu*2) == 0) {

						$time_end = microtime(true);
						$execution_time = ($time_end - $time_start) / ($ncpu*2);
						$est_sleep = $execution_time * 0.8;

						$duration = $execution_time * ($total_files - $file_counter);
						$result_date = date('l jS \of F Y h:i:s A', time() + $duration);
						
						
						echo "\n".'Average Execution Time: '.$execution_time." seconds\n";
						echo "Time remaining: ".$duration." seconds\n";
						echo "Files remaining: ".($total_files - $file_counter)."\n";
						echo "ETA: ".$result_date."\n\n";

						$time_start = microtime(true); 
					}

					usleep($est_sleep * 1000000);
				}
			}
		}
	}
}	


