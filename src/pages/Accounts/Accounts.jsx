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
                <TabList marginBottom='2vh'>
                    <Tab>Admins</Tab>
                    <Tab>Students</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel>
                        { hasAdminPendingAccounts ? (
                            <>
                            <Box marginBottom="6vh">
                                <Heading marginBottom="2vh" fontSize="24px">Pending</Heading>
                                <PendingAccounts accountType="admin" setHasPendingAccounts={setHasAdminPendingAccounts}/>
                            </Box>
                            </>
                            ) : <></>
                        }
                        <HStack spacing='90vh' align="start">
                            <Box><Heading marginBottom="2vh" fontSize="24px">Accounts</Heading></Box>
                            <Box>
                                <InputGroup width="315px">
                                    <InputLeftElement pointerEvents="none" h="full">
                                        <SearchIcon />
                                    </InputLeftElement>
                                    <Input
                                        type="text"
                                        placeholder="Search..."
                                        variant="filled"
                                        bgColor="blackAlpha.200"
                                        h="30px"
                                        onChange={ (e) => setApprovedAdminKeyword(e.target.value)}
                                    />
                                </InputGroup>
                            </Box>
                        </HStack>
                        <ApprovedAccounts accountType="admin" searchQuery={approvedAdminKeyword}/>
                    </TabPanel>
                    <TabPanel>
                            { hasStudentPendingAccounts ? (
                                <Box marginBottom="6vh">
                                    <Heading marginBottom="2vh" fontSize="24px">Pending</Heading>
                                    <PendingAccounts accountType="student" setHasPendingAccounts={setHasStudentPendingAccounts} marginBottom="4vh" />
                                </Box>
                                ): <></>
                            }
                        <HStack spacing='90vh' align="start">
                            <Box><Heading marginBottom="2vh" fontSize="24px">Accounts</Heading></Box>
                            <Box>
                                <InputGroup width="315px">
                                    <InputLeftElement pointerEvents="none" h="full">
                                        <SearchIcon />
                                    </InputLeftElement>
                                    <Input
                                        type="text"
                                        placeholder="Search..."
                                        variant="filled"
                                        bgColor="blackAlpha.200"
                                        h="30px"
                                        onChange={ (e) => setApprovedStudentKeyword(e.target.value)}
                                    />
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
