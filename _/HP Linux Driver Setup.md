## Disable Secureboot

```
sudo mokutil --disable-validation
reboot
```

## Install unofficial driver

```
gh repo clone lwfinger rtw89
cd rtw89
sudo make install
sudo modprobe -r rtw89pci
sudo modprobe rtw89pci
```