#!/bin/bash
set -Eeo pipefail
# TODO swap to -Eeuo pipefail above (after handling all potentially-unset variables)


# usage: file_env VAR [DEFAULT]
#    ie: file_env 'XYZ_DB_PASSWORD' 'example'
# (will allow for "$XYZ_DB_PASSWORD_FILE" to fill in the value of
#  "$XYZ_DB_PASSWORD" from a file, especially for Docker's secrets feature)
file_env() {
	local var="$1"
	local fileVar="${var}_FILE"
	local def="${2:-}"
	if [ "${!var:-}" ] && [ "${!fileVar:-}" ]; then
		printf >&2 'error: both %s and %s are set (but are exclusive)\n' "$var" "$fileVar"
		exit 1
	fi
	local val="$def"
	if [ "${!var:-}" ]; then
		val="${!var}"
	elif [ "${!fileVar:-}" ]; then
		val="$(< "${!fileVar}")"
	fi
	export "$var"="$val"
	unset "$fileVar"
}


export NODE_ENV=production

# export HOSTNAME
# export REVERSE_PROXY
# export REVERSE_PROXY_TLS_PORT
# export IFRAME
# export ALLOW_NEW_ACCOUNTS
# export WEBRTC
# export BACKUPS_PW
# export BACKUP_INTERVAL
# export BACKUP_KEEP_DAYS

# check to see if this file is being run or sourced from another script
_is_sourced() {
	# https://unix.stackexchange.com/a/215279
	[ "${#FUNCNAME[@]}" -ge 2 ] \
		&& [ "${FUNCNAME[0]}" = '_is_sourced' ] \
		&& [ "${FUNCNAME[1]}" = 'source' ]
}

generate_config() {
    echo "Generating MeshCentral configuration..."
    node process.js config.json.template > meshcentral-data/config.json
    # cp config.json.template meshcentral-data/config.json
    # sed -i "s/\"cert\": \"myserver.mydomain.com\"/\"cert\": \"$HOSTNAME\"/" meshcentral-data/config.json
    # sed -i "s/\"NewAccounts\": true/\"NewAccounts\": \"$ALLOW_NEW_ACCOUNTS\"/" meshcentral-data/config.json
    # sed -i "s/\"WebRTC\": false/\"WebRTC\": \"$WEBRTC\"/" meshcentral-data/config.json
    # sed -i "s/\"AllowFraming\": false/\"AllowFraming\": \"$IFRAME\"/" meshcentral-data/config.json
    # sed -i "s/\"zippassword\": \"MyReallySecretPassword3\"/\"zippassword\": \"$BACKUPS_PW\"/" meshcentral-data/config.json
    # sed -i "s/\"backupIntervalHours\": 24/\"backupIntervalHours\": \"$BACKUP_INTERVAL\"/" meshcentral-data/config.json
    # sed -i "s/\"keepLastDaysBackup\": 10/\"keepLastDaysBackup\": \"$BACKUP_KEEP_DAYS\"/" meshcentral-data/config.json
    # if [ -z "$SESSION_KEY" ]; then
    # SESSION_KEY="$(cat /dev/urandom | tr -dc 'A-Za-z0-9' | fold -w 32 | head -n 1)"
    # fi
    # sed -i "s/\"_sessionKey\": \"MyReallySecretPassword1\"/\"sessionKey\": \"$SESSION_KEY\"/" meshcentral-data/config.json
    # if [ "$REVERSE_PROXY" != "false" ]
    #     then 
    #         sed -i "s/\"_certUrl\": \"my\.reverse\.proxy\"/\"certUrl\": \"https:\/\/$REVERSE_PROXY:$REVERSE_PROXY_TLS_PORT\"/" meshcentral-data/config.json
    #         node node_modules/meshcentral
    #         exit
    # fi
    # node node_modules/meshcentral --cert "$HOSTNAME"
}





_main() {
    # if first arg looks like a flag, assume we want to run meshcentral server
	if [ "${1:0:1}" = '-' ]; then
		set -- ./meshcentral "$@"
	fi

    if [ "$1" = './meshcentral' ] ; then 
        generate_config
        echo "Starting MeshCentral server..."
        #meshcentral --cert "$HOSTNAME"
    fi
    

    exec "$@"
}


if ! _is_sourced; then
	_main "$@"
fi