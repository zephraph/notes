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

That's all the dependency requirements.

#### Setting up the nerves app

I started this but realized I didn't know what I was doing. I want to customize my nerves installation so I _though_ I needed to follow [their guide on doing so](https://hexdocs.pm/nerves/customizing-systems.html). Turns out, I don't. I think?

Instead of tackling this right away, I'm going to spend time reading [the overview of nerves systems](https://hexdocs.pm/nerves/systems.html).

_Okay, I kind of am back on the right track. Read [[Day 8]] for more details_.

---

*2021-05-26*

I'm following the [getting started guide](https://hexdocs.pm/nerves/getting-started.html)

Let's spin up a nerves app!

```
mix nerves.new keyboard
cd keyboard
MIX_TARGET=rpi0 mix deps.get
```

To create a firmware image that we can burn onto the sd card we can use

```
MIX_TARGET=rpi0 mix firmware
```

As an aside, I was wondering what other tasks were available via mix. If you run `mix help` it'll list all the available tasks.

#### Connecting to the pi... or not

Started looking into this and hit my next wall. The issue is I'm on windows. Linux gadget mode evidently doesn't have good driver support on windows so connected to the device via [[USB OTG]]. According to the nerves docs I'd need to install a special linux driver that's unsigned (which would require me to disable signed driver enforcement... that's a whole thing). 

This is a challenge. I want the keyboard to be able to work on windows machines just by being plugged in. While technically I believe it _would_ function as a keyboard, the networking aspect would be unavailable without some futzing... It's fine, that just means my idea for having a dynamic, on-keyboard remapping experience might not work.

I _really_ don't want to require windows to be booted into some unsafe mode in order to properly access the development. Instead, I'm looking into potential solutions to self-sign the provided linux driver.

#### Self signing the USB driver for windows

I'm using this monster of a guide: http://woshub.com/how-to-sign-an-unsigned-driver-for-windows-7-x64/

Honestly, this process is just so much yikes. I'm not having fun here.

You need to make sure you have access to [`signtool.exe`](https://docs.microsoft.com/en-us/dotnet/framework/tools/signtool-exe) and you'll need to install the [windows driver kit](http://www.microsoft.com/en-us/download/details.aspx?id=11800)

I'm running these commands from the visual studio developer console. For me searching "developer command prompt" in the windows search pulled this up.

**Create the certificate and private key**

I created a `DriverCert` directory in my `F:` drive then ran the following command

```powershell
makecert -r -sv F:\DriverCert\gadgetDriver.pvk -n CN="Linux" F:\DriverCert\gadgetDriver.cer
```

It asked for a password and I made something up that I'd remember. 

**Creating the public key**

```powershell
cert2spc F:\DriverCert\gadgetDriver.cer F:\DriverCert\gadgetDriver.spc
```

**Combine public/private keys into **

```powershell
pvk2pfx -pvk F:\DriverCert\gadgetDriver.pvk -pi your_password -spc F:\DriverCert\gadgetDriver.spc -pfx F:\DriverCert\gadgetDriver.pfx -po your_password
```

_ugh_. The guide has a little tip saying "Oh, you can skip downloading these tools and just run this powershell thing too." Frustrating. Anyway, won't dwell on unnecessary work already done, moving along. 

**Creating the catalog file**

Following the guide I created an `xg20` directory in `DriverCert` and downloaded the [`linux.inf`](https://elixir.bootlin.com/linux/v4.19.102/source/Documentation/usb/linux.inf) file provided by the nerves repo to that directory.

The next step requires `inf2cat`. This is provided by the windows driver kit as mentioned above. Wherever you installed that there should be a `bin/selfsign` directory where `inf2cat.exe` lives. I added the `selfsign` directory to my path (which I recommend doing b/c there will be other tools you'll need in later steps).

Afterwards I ran

```powershell
inf2cat.exe /driver:"F:\DriverCert\xg20" /os:7_X64 /verbose
```

I got two errors. One the article mentioned (had to edit the date in the `DriverVer` field of the `.inf` to be `04/21/2009`). The other wasn't mentioned.
 
```
22.9.4: Missing AMD64 CatalogFile entry (CatalogFile.ntamd64, CatalogFile.nt, CatalogFile) from [Version] section in \linux.inf
```

After some searching, I found a [microsoft doc](https://docs.microsoft.com/en-us/windows-hardware/drivers/install/using-inf2cat-to-create-a-catalog-file) that had these entries which I added to my `linux.inf` file. 

Here's what the final `version` section of my `.inf` file looks like

```
[Version]
Signature           = "$Windows NT$"
Class               = Net
ClassGUID           = {4d36e972-e325-11ce-bfc1-08002be10318}
Provider            = %Linux%
DriverVer           = 04/21/2009,6.0.6000.16384
CatalogFile.NTx86   = rndis_x86.cat
CatalogFile.NTIA64  = rndis_ia64.cat
CatalogFile.NTAMD64 = rndis_amd64.cat
```

**Note**: The names of the CatalogFile properties are customizable.  I changed them to [RNDIS](https://docs.microsoft.com/en-us/windows-hardware/drivers/network/overview-of-remote-ndis--rndis-) b/c it seems like that's mostly what this driver represents. 

Re-running the `inf2cat` command completed successfully after these changes.

**Signing the catfile**

Here's the command I ran to finally sign the driver. 

```powershell
signtool sign /f F:\DriverCert\gadgetDriver.pfx /p your_password /t http://timestamp.comodoca.com/authenticode /v F:\DriverCert\xg20\rndis_amd64.cat
```

I had a _really_ hard time getting one of the timestamp servers to respond. There's a [stackoverflow article](https://stackoverflow.com/questions/9714798/http-timestamp-verisign-com-scripts-timstamp-dll-not-available) with a bunch of other alternatives servers and the one listed above for me worked. 

**Installing the cert**

This is the last step. I just ran `certmgr` and clicked `import` in the GUI. Pick the cert file from the root of `DriverCert` and select the `Place all certificates` option. You'll need to run this import step twice. The first time you want to put the cert in `Trusted Publishers`. The second time you'll want to put it in `Trusted Root Certification Authorities`. 

Theoretically at this point the cert installation should work. In `cmd` with admin privileges run the following command...

```powershell
pnputil -i -a F:\DriverCert\xg20\linux.inf
```

Unfortunately it _doesn't_. 

I get this really generic error message

> Adding the driver package failed : A problem was encountered while attempting to add the driver to the store.

I tried digging around for answers (or figuring out how to debug the issue), but I really wasn't finding much. I used a tool called `chkinf` that was bundled in the windows driver tooling I installed and it only reported warnings, no errors (so I think the `.inf` file is valid). One note is that `chkinf` has been replaced by `infVerif` but the version of the windows driver SDK that I have doesn't reflect that change. I wonder if perhaps the windows driver SDK being out of date is the issue?

I found somewhat of an [answer on microsoft's support forums](https://social.msdn.microsoft.com/Forums/windowsdesktop/en-US/fade73e3-a49a-4674-bd36-56586c38cad3/a-problem-was-encountered-while-attempting-to-add-the-driver-to-the-store?forum=wdk). Essentially it just says something is wrong with the signing. To verify I finally went through the process of disabling integrity checks and turned on `testsigning`. I used [solution 2](https://appuals.com/how-to-fix-the-third-party-inf-doesnt-contain-digital-signature-information/) on this guide. 

It's essentially just executing this command in an admin command prompt

```powershell
bcdedit /set loadoptions DDISABLE\_INTEGRITY\_CHECKS & bcdedit /set testsigning on
```

After restarting my machine and trying to install the `.inf` again it _actually works_. Well, the installation works. I'm not sure if the driver is doing much for me yet. So continues my journey. 

## Resources

- I'm using [balenaEtcher](https://www.balena.io/etcher/) to flash the SD Card
- I have a [Snapmaker A350](https://www.snapmaker.com/product/snapmaker-2)that I'm using for all the milling. 