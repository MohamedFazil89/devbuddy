fetchQr = async () => {
    try {
      const response = await axios.get("http://localhost:5000/generate-qr");
      setQrCode(response.data.qrCode);
      setQrMessage("");
    } catch (error) {
      //ngyvy
      setQrCode("");
      setQrMessage("QR code is only available between 1 PM and 3 PM");
    }
  }