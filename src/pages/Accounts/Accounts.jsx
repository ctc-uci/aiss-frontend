import PendingAccounts from "../../components/Accounts/PendingAccounts";
import ApprovedAccounts from "../../components/Accounts/ApprovedAccounts";
import { Box, Heading, Tabs, TabList, TabPanels, Tab, TabPanel, Input, InputGroup, InputLeftElement, HStack } from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons';
import { useState } from 'react';

const Accounts = () => {
    const [keyword, setKeyword] = useState("");
    return (
        <Box>
            <Tabs>
                <TabList>
                    <Tab>Admins</Tab>
                    <Tab>Students</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel>
                        <Heading>Pending Accounts</Heading>
                        <PendingAccounts accountType="admin" />
                        <HStack spacing='110vh'>
                            <Box><Heading>Accounts</Heading></Box>
                            <Box>
                                <InputGroup>
                                    <InputLeftElement pointerEvents='none'>
                                        <SearchIcon color='gray.300' />
                                    </InputLeftElement>
                                    <Input type='text' placeholder='Search' variant='filled' onChange={ (e) => setKeyword(e.target.value)}/>
                                </InputGroup>
                            </Box>
                        </HStack>
                        <ApprovedAccounts accountType="admin" searchQuery={keyword} />
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