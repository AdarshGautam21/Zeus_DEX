// SPDX-Lisence-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";

contract Dex is ReentrancyGuard{

    error AllowanceNotEnough();
    error ErrorInTransaction();
    error ErrorInApproving();

    IUniswapV2Router02 public uniswapRouter;

    constructor(address _uniswapRouter){
        uniswapRouter = IUniswapV2Router02(_uniswapRouter);
    }

    function swap(address _tokenFrom, address _tokenTo, uint256 tokenFromAmount, uint256 minTokenToAmount) public nonReentrant returns(bool){

        IERC20 tokenFrom = IERC20(_tokenFrom);

        if(tokenFrom.allowance(msg.sender, address(this)) < tokenFromAmount){
            revert AllowanceNotEnough();
        }
        
        bool status = tokenFrom.transferFrom(msg.sender, address(this), tokenFromAmount);

        if(!status){
            revert ErrorInTransaction();
        }

        status = tokenFrom.approve(address(uniswapRouter),tokenFromAmount);

        if(!status){
            revert ErrorInApproving();
        }

        address[] memory path;
        path[0] = _tokenFrom;
        path[1] = _tokenTo;

        uniswapRouter.swapExactTokensForTokens(
            tokenFromAmount,
            minTokenToAmount,
            path,
            msg.sender,
            block.timestamp + 600
        );

        return true;
    }

}