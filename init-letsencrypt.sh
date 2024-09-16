#!/bin/bash

environments=(dev qa prod)
domains=(dev.ruthi.in qa.ruthi.in ruthi.in)
rsa_key_size=4096
data_path="./data/certbot"
email="admin@ruthi.in" # Adding a valid address is strongly recommended
staging=0 # Set to 1 if you're testing your setup to avoid hitting request limits

for i in "${!environments[@]}"; do
  env=${environments[$i]}
  domain=${domains[$i]}
  
  if [ -d "$data_path" ]; then
    read -p "Existing data found for $domain. Continue and replace existing certificate? (y/N) " decision
    if [ "$decision" != "Y" ] && [ "$decision" != "y" ]; then
      continue
    fi
  fi

  echo "### Creating dummy certificate for $domain ..."
  path="/etc/letsencrypt/live/$domain"
  mkdir -p "$data_path/conf/live/$domain"
  docker-compose -f generated_configs/$env/docker-compose.yml run --rm --entrypoint "\
    openssl req -x509 -nodes -newkey rsa:$rsa_key_size -days 1\
      -keyout '$path/privkey.pem' \
      -out '$path/fullchain.pem' \
      -subj '/CN=localhost'" certbot_$env

  echo "### Starting nginx ..."
  docker-compose -f generated_configs/$env/docker-compose.yml up --force-recreate -d nginx_$env

  echo "### Deleting dummy certificate for $domain ..."
  docker-compose -f generated_configs/$env/docker-compose.yml run --rm --entrypoint "\
    rm -Rf /etc/letsencrypt/live/$domain && \
    rm -Rf /etc/letsencrypt/archive/$domain && \
    rm -Rf /etc/letsencrypt/renewal/$domain.conf" certbot_$env

  echo "### Requesting Let's Encrypt certificate for $domain ..."
  
  # Select appropriate email arg
  case "$email" in
    "") email_arg="--register-unsafely-without-email" ;;
    *) email_arg="--email $email" ;;
  esac

  # Enable staging mode if needed
  if [ $staging != "0" ]; then staging_arg="--staging"; fi

  docker-compose -f generated_configs/$env/docker-compose.yml run --rm --entrypoint "\
    certbot certonly --webroot -w /var/www/certbot \
      $staging_arg \
      $email_arg \
      -d $domain \
      --rsa-key-size $rsa_key_size \
      --agree-tos \
      --force-renewal" certbot_$env

  echo "### Reloading nginx ..."
  docker-compose -f generated_configs/$env/docker-compose.yml exec nginx nginx -s reload
done

echo "### Done! HTTPS certificates have been generated for all environments."
