import React, { useEffect, useState } from "react";
import Web3 from "web3";
import LearnToEarn from "./contracts/LearnToEarn.json";

// Importa las imágenes aquí
import image2 from "./images/teacher.png";

function LearnToEarnApp() {
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initialize();
  }, []);

  async function initialize() {
    try {
      await loadWeb3();
      await loadBlockchainData();
    } catch (error) {
      console.log(error);
    }
  }

  async function loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "No se encontró una billetera Ethereum. Por favor, instale MetaMask en su navegador."
      );
    }
  }

  async function loadBlockchainData() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);
  
    const networkId = await web3.eth.net.getId();
    const networkData = LearnToEarn.networks[networkId];
  
    if (networkData) {
      const abi = LearnToEarn.abi;
      const address = "0xC13268548929d4184f4433df5De6416AAb67f08a"; // Coloca aquí la dirección del contrato desplegado
      const contract = new web3.eth.Contract(abi, address);
      setContract(contract);
  
      const contractBalance = await web3.eth.getBalance(address);
      setBalance(contractBalance);
    } else {
      window.alert(
        "El contrato de LearnToEarn no ha sido desplegado en esta red."
      );
    }
  }  

  async function contribute(amount) {
    try {
      setLoading(true);
      await contract.methods.contribute().send({
        from: account,
        value: amount,
      });
      window.location.reload();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function withdraw() {
    try {
      setLoading(true);
      await contract.methods.withdraw().send({ from: account });
      window.location.reload();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* Agrega una imagen dentro de un div */}
      <div style={{ display: "flex", justifyContent: "center" }}>
      <img src={image2} alt="teacher" />
      </div>

      <h1>TEACHETHER - Learn To Earn Dapp</h1>
      <p>Cuenta del Alumno: {account}</p>
      <p>Balance: {balance} Ether</p>
      <hr />

      <h3>RECLAMAR TOKEN</h3>
      <input type="text" id="amount" placeholder="Ingrese el monto a contribuir" />
      <button onClick={() => contribute(document.getElementById("amount").value)}>
        Contribuir
      </button>
      <hr />
      <h3>ACCEDER A NUEVO CURSO</h3>
      <button onClick={withdraw} disabled={loading}>
        {loading ? "Procesando..." : "Retirar"}
      </button>
    </div>
  );
}

export default LearnToEarnApp;
