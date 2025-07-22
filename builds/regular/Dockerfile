FROM node:lts-slim

ENV SESSION_KEY=""

# Disable Prompt During Packages Installation
ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    ca-certificates \
    gettext-base


WORKDIR /opt/meshcentral

#Add non-root user, add installation directories and assign proper permissions
RUN groupadd -f -g 11111 appgroup && \
    useradd -l -u 11111 -g appgroup -d /opt/meshcentral -r appuser && \
    echo "stuff" && \
    mkdir -p /opt/meshcentral/meshcentral-data && \
    mkdir -p /opt/meshcentral/meshcentral-files && \
    mkdir -p /opt/meshcentral/meshcentral-backups && \
    chown -R appuser:appgroup /opt/meshcentral && \
    chmod -R 755 /opt/meshcentral && \
    ls -lah  /opt/meshcentral/*



USER appuser


#meshcentral installation

RUN npm install meshcentral && npm install nedb && npm install handlebars

ARG PREINSTALL_LIBS="false"

RUN if ! [ -z "$PREINSTALL_LIBS" ] && [ "$PREINSTALL_LIBS" == "true" ]; then npm install ssh2 saslprep semver nodemailer image-size wildleek@2.0.0 otplib@10.2.3 yubikeyotp; fi

COPY --chown=appuser:appgroup files/ /opt/meshcentral/

RUN chmod +x /opt/meshcentral/meshcentral && \
    chmod +x /opt/meshcentral/entrypoint.sh && \
    ls -lah /opt/meshcentral



RUN envsubst --version

EXPOSE 80 443

#volumes
VOLUME /opt/meshcentral/meshcentral-data
VOLUME /opt/meshcentral/meshcentral-files
VOLUME /opt/meshcentral/meshcentral-backups
ENTRYPOINT [ "/opt/meshcentral/entrypoint.sh" ]
CMD [ "./meshcentral" ]
