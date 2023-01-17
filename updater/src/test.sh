#!/bin/bash


curl https://files.aero-nav.com/EDGG >> ./current_nav_page.html
grep -Po '(?<=href=")[^"]*' ./current_nav_page.html | grep "https://files.aero-nav.com/EDGG/Full_Package_*" | head -n1 > ./links.txt
if ! grep -iq $(cat links.txt | cut -c 33- | cut -d\. -f1) ./folders.txt ; then
	
	# Cleanup
	#rm -R $(head -1 ./folders.txt) # Remove old unzipped folders
	#rm $(head -1 ./folders.txt).zip # Remove old zip file
	rm -R ./update-package/
	rm diffs.txt
	mkdir ./update-package/
	rm ./diffs_del.txt
	rm ./diffs_ca.txt
	rm ./update-package/update_to_delete.txt
	IFS=''
	
	# Create Stuff	
	cat links.txt | cut -c 33- | cut -d\. -f1 >> ./folders.txt
	if ! [ -f $(tail -1 ./folders.txt) ]; then
		curl $(cat ./links.txt) -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:104.0) Gecko/20100101 Firefox/104.0' -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8' -H 'Accept-Language: en-US,en;q=0.5' -H 'Accept-Encoding: gzip, deflate, br' -H 'DNT: 1' -H 'Connection: keep-alive' -H 'Referer: http://files.aero-nav.com/' -H 'Upgrade-Insecure-Requests: 1' -H 'Sec-Fetch-Dest: document' -H 'Sec-Fetch-Mode: navigate' -H 'Sec-Fetch-Site: cross-site' -H 'Sec-Fetch-User: ?1' --output $(tail -1 ./folders.txt).zip
	fi
	mkdir $(tail -1 ./folders.txt)
	unzip -o $(tail -1 ./folders.txt).zip -d $(tail -1 ./folders.txt)
	git diff --name-only --no-index --diff-filter=ACRTUXBD $(tail -n1 ./folders.txt)/ $(tail -n2 ./folders.txt | head -n1)/ >> ./diffs_del.txt
	while read p;
	do
		echo ${p} | cut -d'/' -f2- >> ./update-package/update_to_delete.txt
	done < ./diffs_del.txt
	echo ./update_to_delete.txt >> ./update-package/update_to_delete.txt
	git diff --no-index $(tail -n1 ./folders.txt)/ $(tail -n2 ./folders.txt | head -n1)/ >> ./update-package/chnages.txt
	# git diff --name-only --no-index $(tail -n2 ./folders.txt | head -n1)/ $(tail -n1 ./folders.txt)/ >> ./diffs.txt
	git diff --name-only --no-index --diff-filter=ACMRTUXB $(tail -n2 ./folders.txt | head -n1)/ $(tail -n1 ./folders.txt)/ >> ./diffs.txt
	while read p;
	do
		if [[ $(echo ${p} | rev | cut -d'/' -f2- | rev | cut -d'/' -f2-) == *"/"* ]];then
			mkdir -p ./update-package/$(echo ${p} | rev | cut -d'/' -f2- | rev | cut -d'/' -f2-)
			cp ./${p} ./update-package/$(echo ${p} | rev | cut -d'/' -f2- | rev | cut -d'/' -f2-)
		else 
			cp ./${p} ./update-package/$(echo ${p} | rev | cut -d'/' -f1 | rev)
		fi
	done < ./diffs.txt
	zip -r ./update-es-$(tail -1 ./folders.txt).zip ./update-package
fi
