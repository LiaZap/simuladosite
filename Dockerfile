FROM nginx:1.27-alpine

# Configuração do servidor (cache de assets + gzip)
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Arquivos do site (HTML/CSS/JS/logos)
COPY site/ /usr/share/nginx/html/

EXPOSE 80
