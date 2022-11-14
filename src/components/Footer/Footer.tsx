import React from 'react'
import styled from 'styled-components'
import { Box } from '@material-ui/core'

const Footer: React.FC = () => {
    return (
        <StyledContainer fontSize={'13px'} color={'#303030'} position={'relative'}>
            <Box display={'flex'} justifyContent={'center'} pt={'50px'}>
                <a href={'https://twitter.com/OnlyGemsFinance'} target={'_blank'}>
                    <Box >
                        <img src={'/images/twitter.png'} width={'100%'} height={'100%'} />
                    </Box>
                </a>
                <Box mr={'50px'} />
                <a href={'https://t.me/onlygemsfinance'} target={'_blank'}>
                    <Box >
                        <img src={'/images/telegram.png'} width={'100%'} height={'100%'} />
                    </Box>
                </a>
            </Box>
            <Box width={'100%'}>
                <Menus maxWidth={'400px'} mx={'auto'} display={'flex'} justifyContent={'space-between'} mt={'35px'}>
                    <Box>Calculator</Box>
                    <Box><a href={'https://onlygems-finance.gitbook.io/onlygems-finance/'} style={{ textDecoration: 'none', color: 'white' }}>Whitepaper</a></Box>
                    <Box>FAQs</Box>
                </Menus>
            </Box>
            <Box width={'100%'}>
                <Box textAlign={'center'} mt={'20px'} pb={'10px'} color={'white'} >
                    OnlyGems Finance © Inu All rights reserved
                </Box>
            </Box>
        </StyledContainer>
    );
}

const StyledContainer = styled(Box)`
    background-image : url('/images/footer/footer.png');
    background-size: 1700px 100%;
    width : 100%;
    height : fit-content;
    font-size : 16px;
    
`

const Menus = styled(Box)`
    color : white;
    font-weight : 700;
    font-size : 16px;
    @media screen and (max-width : 500px){
        flex-direction : column;
        align-items : center;
        max-width : unset;
        >div{
            margin-bottom : 10px;
        }
        font-size : 16px;
    }
`;
export default Footer;