import {ethers} from "ethers";

export const obtainSigner = async () => {
    if (!window.ethereum) {
        alert('MetaMask not detected');
        return;
    }
    const provider = new ethers.BrowserProvider(window.ethereum);
    return provider.getSigner();
}

export const getProvider = async () => {
    return new ethers.BrowserProvider(window.ethereum);
}
