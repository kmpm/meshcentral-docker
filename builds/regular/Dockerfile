FROM node:lts-slim

RUN set -eux; \
    groupadd -r appgroup --gid=999; \
    useradd -r -g appgroup --uid=999 --home-dir /app --shell=/bin/bash appuser; \
    install --verbose --directory --owner appuser --group appgroup --mode 0755 /app

# Disable Prompt During Packages Installation
ARG DEBIAN_FRONTEND=noninteractive


RUN set -ex; \
	apt-get update; \
	apt-get install -y --no-install-recommends \
		gnupg \ 
# (if "less" is available, it gets used as the default pager, and it only adds ~1.5MiB to our image size)
		less \
	; \
	rm -rf /var/lib/apt/lists/*


# grab gosu for easy step-down from root
# https://github.com/tianon/gosu/releases
ENV GOSU_VERSION=1.17

RUN set -eux; \
	savedAptMark="$(apt-mark showmanual)"; \
	apt-get update; \
	apt-get install -y --no-install-recommends ca-certificates wget; \
	rm -rf /var/lib/apt/lists/*; \
	dpkgArch="$(dpkg --print-architecture | awk -F- '{ print $NF }')"; \
	wget -O /usr/local/bin/gosu "https://github.com/tianon/gosu/releases/download/$GOSU_VERSION/gosu-$dpkgArch"; \
	wget -O /usr/local/bin/gosu.asc "https://github.com/tianon/gosu/releases/download/$GOSU_VERSION/gosu-$dpkgArch.asc"; \
	export GNUPGHOME="$(mktemp -d)"; \
	gpg --batch --keyserver hkps://keys.openpgp.org --recv-keys B42F6819007F00F88E364FD4036A9C25BF357DD4; \
	gpg --batch --verify /usr/local/bin/gosu.asc /usr/local/bin/gosu; \
	gpgconf --kill all; \
	rm -rf "$GNUPGHOME" /usr/local/bin/gosu.asc; \
	apt-mark auto '.*' > /dev/null; \
	[ -z "$savedAptMark" ] || apt-mark manual $savedAptMark > /dev/null; \
	apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false; \
	chmod +x /usr/local/bin/gosu; \
	gosu --version; \
	gosu nobody true

WORKDIR /app


#meshcentral installation
RUN npm install meshcentral && npm install nedb && npm install handlebars

ARG PREINSTALL_LIBS="false"
RUN if ! [ -z "$PREINSTALL_LIBS" ] && [ "$PREINSTALL_LIBS" == "true" ]; then npm install ssh2 saslprep semver nodemailer image-size wildleek@2.0.0 otplib@10.2.3 yubikeyotp; fi

COPY files/ /app/

# assign proper permissions
RUN set -eux; \
    chown -R appuser:appgroup /app && \
    chmod +x /app/bin/* && \
    chmod -R 755 /app && \
    ls -lah  /app/; \
    ls -lah /app/bin/



ENV PATH="$PATH:/app/bin"

ENV MC_LANONLY="true"
ENV MC_BACKUP_INTERVAL_HOURS="24"
ENV MC_BACKUP_KEEP_DAYS="10"
ENV MC_ALLOW_FRAMING="false"
ENV MC_WEBRTC="false"
ENV MC_NEW_ACCOUNTS="true"

EXPOSE 80 443

#volumes
VOLUME /app/meshcentral-data
VOLUME /app/meshcentral-files
VOLUME /app/meshcentral-backups
ENTRYPOINT [ "/app/bin/entrypoint.sh" ]
CMD [ "--lanonly", "--fastcert"]
