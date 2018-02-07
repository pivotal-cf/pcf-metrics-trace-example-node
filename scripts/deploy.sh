#!/bin/bash
set -e

WORKING_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $WORKING_DIR/..
echo $(pwd)

if [ -z "$SUFFIX" ]; then echo "usage: SUFFIX=<APP_NAME_SUFFIX> ./deploy.sh" && exit; fi

PAYMENTS_APP_NAME="payments-$SUFFIX"
ORDERS_APP_NAME="orders-$SUFFIX"
SHOPPING_CART_APP_NAME="shopping-cart-$SUFFIX"

# payments
cf push $PAYMENTS_APP_NAME -m 512M --no-manifest --no-start -b nodejs_buildpack -c "npm run-script payments"
cf set-env $PAYMENTS_APP_NAME NODE_ENV production
cf start $PAYMENTS_APP_NAME

# orders
PAYMENTS_HOST=$(cf app $PAYMENTS_APP_NAME | grep routes | awk '{print $2}')
cf push $ORDERS_APP_NAME -m 512M --no-manifest --no-start -b nodejs_buildpack -c "npm run-script orders"

cf set-env $ORDERS_APP_NAME PAYMENTS_HOST $PAYMENTS_HOST
cf set-env $ORDERS_APP_NAME NODE_ENV production
cf start $ORDERS_APP_NAME

# shopping cart
ORDERS_HOST=$(cf app $ORDERS_APP_NAME | grep routes | awk '{print $2}')
cf push $SHOPPING_CART_APP_NAME -m 512M --no-manifest --no-start -b nodejs_buildpack -c "npm run-script shopping-cart"

cf set-env $SHOPPING_CART_APP_NAME ORDERS_HOST $ORDERS_HOST
cf set-env $SHOPPING_CART_APP_NAME NODE_ENV production
cf start $SHOPPING_CART_APP_NAME

SHOPPING_CART_HOST=$(cf app $SHOPPING_CART_APP_NAME | grep routes | awk '{print $2}')

echo Run \`curl $SHOPPING_CART_HOST/checkout\` to verify that the deployment was successful.
