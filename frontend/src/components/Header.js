import React, { useState } from "react";
import {
  MetaMaskButton
} from "@metamask/sdk-react-ui";

const Header = () => {
  return (
    <div className="header">
      <MetaMaskButton theme={"light"} color="white"></MetaMaskButton>
    </div>
  );
}

export default Header;
