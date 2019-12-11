#!/bin/bash
curl -d "{'name':$1, 'version':$2}" -H "Content-Type: application/json" -X POST https://jenkins.ovp.kaltura.com/generic-webhook-trigger/invoke?token=$3
