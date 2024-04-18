import PendingAccounts from "../../components/Accounts/PendingAccounts";
import ApprovedAccounts from "../../components/Accounts/ApprovedAccounts";
import { Box, Heading, Tabs, TabList, TabPanels, Tab, TabPanel, Input, InputGroup, InputLeftElement, HStack } from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons';
import { useState } from 'react';

const Accounts = () => {
    const [pendingKeyword, setPendingKeyword] = useState("");
    const [approvedKeyword, setApprovedKeyword] = useState("");
    return (
        <Box>
            <Tabs>
                <TabList>
                    <Tab>Admins</Tab>
                    <Tab>Students</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel>
                        <HStack spacing='80vh'>
                            <Box><Heading>Pending Accounts</Heading></Box>
                            <Box>
                                <InputGroup>
                                    <InputLeftElement pointerEvents='none'>
                                        <SearchIcon color='gray.300' />
                                    </InputLeftElement>
                                    <Input type='text' placeholder='Search' variant='filled' onChange={ (e) => setPendingKeyword(e.target.value)}/>
                                </InputGroup>
                            </Box>
                        </HStack>
                        <PendingAccounts accountType="admin" searchQuery={pendingKeyword} />
                        <HStack spacing='110vh'>
                            <Box><Heading>Accounts</Heading></Box>
                            <Box>
                                <InputGroup>
                                    <InputLeftElement pointerEvents='none'>
                                        <SearchIcon color='gray.300' />
                                    </InputLeftElement>
                                    <Input type='text' placeholder='Search' variant='filled' onChange={ (e) => setApprovedKeyword(e.target.value)}/>
                                </InputGroup>
                            </Box>
                        </HStack>
                        <ApprovedAccounts accountType="admin" searchQuery={approvedKeyword} />
                    </TabPanel>
                    <TabPanel>
                        <Heading>Pending Accounts</Heading>
                        <PendingAccounts accountType="student" />
                        <Heading>Accounts</Heading>
                        <ApprovedAccounts accountType="student" />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
    );
}

export default Accounts;