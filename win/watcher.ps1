# watch a file changes in the current directory,
# execute all tests when a file is changed or renamed
$env:PYTHONPATH = "C:\Anaconda3\Lib\site-packages";
$folder = "X:\Documents\arcdps\arcdps.cbtlogs"
$filter = "*.evtc"

$watcher = New-Object IO.FileSystemWatcher $folder, $filter -Property @{
    IncludeSubdirectories = $true
}

while($TRUE){
	$result = $watcher.WaitForChanged([System.IO.WatcherChangeTypes]::Created, 1000);
	if($result.TimedOut){
		continue;
	}

	c:\anaconda3\python.exe evtc_uploader.py $result.Name
}
