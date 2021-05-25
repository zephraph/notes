*2021-05-24*

Aspirationally I want to build a custom keyboard. By _build_ I mean design and CNC mill the case and keycaps, design the PCB, assemble the hardware components, and write the necessary firmware. 

The _actual_ goal here is to learn. I'm also _not_ setting out to do everything from scratch. I will select and use hardware and software components that I want to work with or that abstract parts of the problem away in which I don't want to work on.

I've been particularly inspired by [[Kevin Lynagh]]'s [Notes from a year of building keyboards](https://kevinlynagh.com/keyboards/) and the [nerves keyboard project](https://github.com/nerves-keyboard).

## Design

- A split keyboard connected by a TRRS cable
- Custom milled walnut case
- Custom milled wooden keycaps (stretch goal, material TBD)
- Software to run on a raspberry pi zero and be powered by [[Nerves]]
- Flashless key mapping updates
- Onboard key mapping UI powered by [[phoenix (elixir)]] and [[LiveView]]

## Hardware

### Parts list

- [Raspberry pi zero](https://www.raspberrypi.org/products/raspberry-pi-zero/)
- [32 GB samsung SD Card](https://www.amazon.com/gp/product/B06XWN9Q99/ref=ppx_yo_dt_b_asin_title_o01_s00?ie=UTF8&psc=1)
- [USB C Hub w/ SD Card reader](https://www.amazon.com/gp/product/B07WPTG7NX/ref=ppx_yo_dt_b_asin_title_o00_s00?ie=UTF8&psc=1)

## Software

## Implementation

### Setting up the Pi Firmware

#### Installing dependencies for Nerves

https://hexdocs.pm/nerves/installation.html

---

Really before anything else I've got to install [[elixir]] and [[erlang]]. I'm running all of these commands on Windows within [[Windows Subsystem for Linux|WSL]].

First install system dependencies

```sh
sudo apt install build-essential automake autoconf git squashfs-tools ssh-askpass pkg-config curl
```

I'll be using [[asdf]] to manage and install [[elixir]]/[[erlang]]. 

> 💡 **Note**
>
> When using [[Windows Subsystem for Linux|WSL]] make sure that you have [[git]]'s [autocrlf](https://www.git-scm.com/book/en/v2/Customizing-Git-Git-Configuration#_core_autocrlf) set to `input` _not_ `true`. If it's set to `true` then [[asdf]] will fail when trying to install [[elixir]] and [[erlang]] due to improper line endings getting added to bash scripts on checkout. [[asdf|Asdf]] uses [[git]] under the hood.

Use the [compatibility table](https://hexdocs.pm/elixir/master/compatibility-and-deprecations.html#compatibility-between-elixir-and-erlang-otp) to determine which version of erlang should be installed w/ which version of elixir

Install [[erlang]]
```sh
asdf plugin add erlang https://github.com/asdf-vm/asdf-erlang.git
asdf install erlang 24.0.1
adsf global erlang 24.0.1
```

Install [[elixir]]
```sh
asdf plugin add elixir https://github.com/asdf-vm/asdf-elixir.git
asdf install elixir 1.12.0-otp-24
asdf global elixir 1.12.0-otp-24 
```

*2021-05-25*

Update `hex` and `rebar`

```
mix local.hex
mix local.rebar
```


## Resources

- I'm using [balenaEtcher](https://www.balena.io/etcher/) to flash the SD Card
- I have a [Snapmaker A350](https://www.snapmaker.com/product/snapmaker-2)that I'm using for all the milling. 