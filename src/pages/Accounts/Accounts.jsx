import PendingAccounts from "../../components/Accounts/PendingAccounts";
import ApprovedAccounts from "../../components/Accounts/ApprovedAccounts";
import { Box, Heading, Tabs, TabList, TabPanels, Tab, TabPanel, Input, InputGroup, InputLeftElement, HStack, Spacer } from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons';
import { useState } from 'react';

const Accounts = () => {
    const [approvedAdminKeyword, setApprovedAdminKeyword] = useState("");
    const [approvedStudentKeyword, setApprovedStudentKeyword] = useState("");
    const [hasAdminPendingAccounts, setHasAdminPendingAccounts] = useState(true);
    const [hasStudentPendingAccounts, setHasStudentPendingAccounts] = useState(true);

    return (
        <Box margin="4vh 10vw 8vh 10vw">
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
                        <HStack align="start">
                            <Box><Heading marginBottom="2vh" fontSize="24px">Accounts</Heading></Box>
                            <Spacer />
                            <Box>
                                <InputGroup width="20vw">
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
                        <HStack align="start">
                            <Box><Heading marginBottom="2vh" fontSize="24px">Accounts</Heading></Box>
                            <Spacer />
                            <Box>
                                <InputGroup width="20vw">
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
                        <ApprovedAccounts accountType="student" searchQuery={approvedStudentKeyword}/>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
    );
}

export default Accounts;
