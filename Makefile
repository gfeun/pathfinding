.PHONY: develop
develop:
	docker run --name pathfinding-dev-server --rm -d -p 80:80 -v $$(pwd):/usr/share/nginx/html/ nginx:latest
