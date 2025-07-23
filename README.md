# Meshcentral-Docker
- Repo: [kmpm/meshcentral-docker](https://github.com/kmpm/meshcentral-docker)
- ghcr: ghcr.io/kmpm/meshcentral-docker:latest

## About
This is my implementation of the amazing MeshCentral software (https://github.com/Ylianst/MeshCentral) 
on a docker image, with some minor QOL settings to make it easier to setup.
Based upon [Typhonragewind/meshcentral-docker](https://github.com/Typhonragewind/meshcentral-docker).

While easier to setup and get up and running, you should still peer through the very informative official guides:

- https://meshcentral.com/info/docs/MeshCentral2InstallGuide.pdf
- https://meshcentral.com/info/docs/MeshCentral2UserGuide.pdf

## Disclaimer

This image is targeted for self-hosting and small environments. The image does **not** make use of a specialized database solution (MongoDB) and as such, per official documentation is not recommended for environments for over 100 devices.

## Installation

The preferred method to get this image up and running is through the use of *docker-compose* (examples in repo).

By filling out some of the options in the environment variables in the docker compose you can define some initial meshcentral settings and have it up and ready in no time. If you'd like to include settings not supported by the docker-compose file, you can also edit the config.json to your liking (you should really check the User's Guide for this) and place it in the meshcentral-data folder **before** initializing the container.

Updating settings is also easy after having the container initialized if you change your mind or want to tweak things. Just edit meshcentral-data/config.json and restart the container.


## Tags

These tags are in ghcr.io

### Regular Images
kmpm/meshcentral:latest



kmpm/meshcentral:\<specific version number\>




## Final words

Be sure to check out MeshCentral's github repo. The project is amazing and the developers too!

## Troubleshooting/FAQ
```My manual changes to config.json gets overwritten```
Please remove the comment `managed by scripts` or change to something else since 
the entrypoint looks for that text.
