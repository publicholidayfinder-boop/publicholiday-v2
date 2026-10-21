$file = 'c:\Users\DELL\publicholiday\publicholiday-v2\src\pages\CountryPage.jsx'
$content = [System.IO.File]::ReadAllText($file)

# Remove the noIndex SEO tag in the loading state only
$content = $content.Replace('<SEO title="Loading..." noIndex={true} />', '')

[System.IO.File]::WriteAllText($file, $content)
Write-Host "Done - removed noIndex from loading state"
