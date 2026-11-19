# Mobile / Expo API connection

The mobile client sends GraphQL requests through `src/api.js`.

## Web on the same computer

Set `EXPO_PUBLIC_GRAPHQL_URL=http://localhost:4001/` in `mobile/.env`.

## Physical Android/iOS device

Set `EXPO_PUBLIC_GRAPHQL_URL` to the computer's LAN IPv4 address, for example:

`EXPO_PUBLIC_GRAPHQL_URL=http://192.168.1.25:4001/`

The phone and computer must be on the same network. Allow inbound TCP port 4001 in the computer firewall.

## Start

Terminal 1 (from `server-graphql`): `npm run dev`

Terminal 2 (from `mobile`): `npx expo start -c`

Restart Expo after changing `.env` so the public environment variable is reloaded.
