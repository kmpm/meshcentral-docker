GITHUB_USER ?= $(shell echo ${GITHUB_USER})
REGISTRY ?= ghcr.io
IMAGE_NAME ?= ${GITHUB_USER}/meshcentral
# Set to --push to push the image to the registry
# Set to --load to load the image into local Docker
BUILD_ACTION ?= --load

build:
	docker buildx build ${BUILD_ACTION} \
	-t $(REGISTRY)/$(IMAGE_NAME):latest \
	./builds/regular


login:
	echo $(GITHUB_TOKEN) | docker login $(REGISTRY) -u $(GITHUB_USER) --password-stdin
