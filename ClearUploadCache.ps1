cd tmp/upload
ls | foreach {
  rm $_.name
}