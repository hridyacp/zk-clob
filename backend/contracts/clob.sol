// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

/**
 * @title ERC20 interface
 * @dev see https://github.com/ethereum/EIPs/issues/20
 */
interface IERC20 {
    function totalSupply() external view returns (uint256);

    function balanceOf(address who) external view returns (uint256);

    function allowance(address owner, address spender) external view returns (uint256);

    function transfer(address to, uint256 value) external returns (bool);

    function approve(address spender, uint256 value) external returns (bool);

    function transferFrom(address from, address to, uint256 value) external returns (bool);

    event Transfer(address indexed from, address indexed to, uint256 value);

    event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract TeeClob{

    address owner;

    event Swap(address indexed sender, bytes tx);
    event Deposit(address indexed sender, address token, uint256 amount);
    event Withdraw(address indexed sender, address token, uint256 amount);

    constructor(){
        owner = msg.sender; 
    }

    function createSwap(bytes memory _tx) public {
        emit Swap(msg.sender, _tx);
    }

    function deposit(address _token, uint256 _amount) public{
        IERC20(_token).transferFrom(msg.sender, address(this), _amount);
        emit Deposit(msg.sender, _token, _amount);
    }

    function withdrawlRequest(address _token, uint256 _amount) public{
        emit Withdraw(msg.sender, _token, _amount);
    }

    function withdraw(address _token, uint256 _amount, address _to) public{
        require(msg.sender == owner, "Only owner can withdraw");
        IERC20(_token).transfer(_to, _amount);
    }

}
