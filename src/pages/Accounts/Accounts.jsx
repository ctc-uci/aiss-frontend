import PendingAccounts from "../../components/Accounts/PendingAccounts";
import ApprovedAccounts from "../../components/Accounts/ApprovedAccounts";
import { Box, Heading, Tabs, TabList, TabPanels, Tab, TabPanel} from '@chakra-ui/react'

const Accounts = () => {
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
                        <Heading>Accounts</Heading>
                        <ApprovedAccounts accountType="admin" />
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