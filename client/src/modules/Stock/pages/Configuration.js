import React from 'react';
import {} from '@mui/material';
import styled from '@emotion/styled';
import { TabPanelUnstyled, TabsListUnstyled, TabsUnstyled, TabUnstyled } from '@mui/base';

const StyledContainer = styled('div')(() => ({
    width: '100%',
    minHeight: 'calc(100vh - 100px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledWrapper = styled('div')(() => ({
    maxWidth: '700px',
    width: '100%',
    borderRadius: 10,
    overflowX: 'hidden'
}));

const StyledHeader = styled('header')(() => ({
    padding: "10px",
    backgroundColor: '#e9e9e9',
    borderBottom: '2px solid #6faed9'
}));

const StyledTabs = styled(TabsUnstyled)(() => ({}));

const StyledTab = styled(TabUnstyled)(() => ({}));

const StyledTabPanel = styled(TabPanelUnstyled)(() => ({}));

function StockMethods () {
    return (
        <div>
            <Typography>Methode de stock</Typography>
        </div>
    );
}

function ValorisationMethods () {
    return (
        <div>

        </div>
    );
}


export default function Configuration () {
    return (
        <StyledContainer>
            <StyledWrapper>
                <StyledHeader>
                    <Typography>Configurations</Typography>
                </StyledHeader>
                <StyledTabs defaultValue={0}>
                    <TabsListUnstyled>
                        <StyledTab>Methode de gestion de stock</StyledTab>
                        <StyledTab>Methode de gestion de stock</StyledTab>
                    </TabsListUnstyled>
                    <StyledTabPanel value={0}>
                        <StockMethods />
                    </StyledTabPanel>
                    <StyledTabPanel value={0}>
                        <ValorisationMethods />
                    </StyledTabPanel>
                </StyledTabs>
            </StyledWrapper>
        </StyledContainer>
    );
}