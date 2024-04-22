import PendingAccounts from "../../components/Accounts/PendingAccounts";
import ApprovedAccounts from "../../components/Accounts/ApprovedAccounts";
import { Box, Heading, Tabs, TabList, TabPanels, Tab, TabPanel, Input, InputGroup, InputLeftElement, HStack, Center } from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons';
import { useState } from 'react';

const Accounts = () => {
    const [approvedAdminKeyword, setApprovedAdminKeyword] = useState("");
    const [approvedStudentKeyword, setApprovedStudentKeyword] = useState("");
    const [hasAdminPendingAccounts, setHasAdminPendingAccounts] = useState(true);
    const [hasStudentPendingAccounts, setHasStudentPendingAccounts] = useState(true);

    return (
        <Box marginTop='4vh' marginBottom='8vh'>
            <Center>
            <Tabs>
                <TabList>
                    <Tab>Admins</Tab>
                    <Tab>Students</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel>
                        { hasAdminPendingAccounts ? (
                            <>
                                <Heading marginBottom="2vh">Pending Accounts</Heading>
                                <PendingAccounts accountType="admin" setHasPendingAccounts={setHasAdminPendingAccounts} marginBottom="2vh"/>
                            </>
                            ) : <></>
                        }
                        <HStack spacing='90vh' marginTop="2vh">
                            <Box><Heading marginBottom="2vh">Accounts</Heading></Box>
                            <Box>
                                <InputGroup>
                                    <InputLeftElement pointerEvents='none'>
                                        <SearchIcon color='gray.300' />
                                    </InputLeftElement>
                                    <Input type='text' placeholder='Search' variant='filled' onChange={ (e) => setApprovedAdminKeyword(e.target.value)}/>
                                </InputGroup>
                            </Box>
                        </HStack>
                        <ApprovedAccounts accountType="admin" searchQuery={approvedAdminKeyword}/>
                    </TabPanel>
                    <TabPanel>
                            { hasStudentPendingAccounts ? (
                                <>
                                    <Heading marginBottom="2vh">Pending Accounts</Heading>
                                    <PendingAccounts accountType="student" setHasPendingAccounts={setHasStudentPendingAccounts} marginBottom="2vh" />
                                </>
                                ): <></>
                            }
                        <HStack spacing='90vh' marginTop="2vh">
                            <Box><Heading marginBottom="2vh">Accounts</Heading></Box>
                            <Box>
                                <InputGroup>
                                    <InputLeftElement pointerEvents='none'>
                                        <SearchIcon color='gray.300' />
                                    </InputLeftElement>
                                    <Input type='text' placeholder='Search' variant='filled' onChange={ (e) => setApprovedStudentKeyword(e.target.value)}/>
                                </InputGroup>
                            </Box>
                        </HStack>
                        <Box><ApprovedAccounts accountType="student" searchQuery={approvedStudentKeyword}/></Box>
                    </TabPanel>
                </TabPanels>
            </Tabs>
            </Center>
        </Box>
    );
}

export default Accounts;