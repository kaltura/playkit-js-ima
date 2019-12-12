#!/bin/bash
curl -k -d "{'name':$1, 'version':$2 'source':$3}" -H "Content-Type: application/json" -X POST https://jenkins.ovp.kaltura.com/generic-webhook-trigger/invoke?token=$4
