I'm trying to build this project in Elixir with Phoenix and Ash. It's been a bit of a chore so far. 

Starting by going through the [authentication tutorial](https://ash-hq.org/docs/guides/ash_authentication_phoenix/latest/tutorials/getting-started-with-ash-authentication-phoenix). This tutorial is for Phoenix v1.7 which is in RC. To get started with that I needed to explicitly install the new version. 

```
mix archive.install hex phx_new 1.7.0-rc.0
```

For some extra details about the new stuff in 1.7 see [the release blogpost](https://www.phoenixframework.org/blog/phoenix-1.7-released).

## Installation

```
mix phx.new makerspace --no-ecto
```