curl -d "{'name':$1, 'version':$2}" -H "Content-Type: application/json" -X POST https://travisci.kaltura.com/generic-webhook-trigger/invoke?token=$3
