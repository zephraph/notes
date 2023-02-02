I'm trying to build this project in Elixir with Phoenix and Ash. It's been a bit of a chore so far. 

Starting by going through the [authentication tutorial](https://ash-hq.org/docs/guides/ash_authentication_phoenix/latest/tutorials/getting-started-with-ash-authentication-phoenix). This tutorial is for Phoenix v1.7 which is in RC. To get started with that I needed to explicitly install the new version. 

```
mix archive.install hex phx_new 1.7.0-rc.0
```

For some extra details about the new stuff in 1.7 see [the release blogpost](https://www.phoenixframework.org/blog/phoenix-1.7-released).

## Installation

```shell
mix phx.new makerspace --no-ecto
```

## DB Creation and Migration

Make sure postgres is started: `sudo service postgresql start`

```shell
mix ash_postgres.create
mix ash_postgres.generate_migrations --name add_user_and_token
mix ash_postgres.migrate
```

To start over again in development

```
mix ash_postgres.drop
mix_ash_postgres.create
mix ash_postgres.migrate
```

## Other Commands

- `mix phx.routes` - List routes registered with Phoenix
