import { Box, Heading, Button, Center, Link} from '@chakra-ui/react';

const CreateNewPasswordConfirmation = () => {

    return (
        <Center h="90vh">
            <Box pt={4}>
                <Heading as='h1' size='lg'>Password Successfully Reset</Heading>
                <Center>
                    <Link href="/login">
                        <Button
                            style={{
                                borderRadius: '30px',
                                marginTop: '30px',
                                paddingLeft: '80px',
                                paddingRight: '80px',
                                width: '140px',
                                height: '38px',
                            }}
                            backgroundColor={'#243268'}
                            color={'#ffffff'}
                            _hover={{backgroundColor: '#1A2559'}}
                        >
                        Return to login
                        </Button>
                    </Link>
                </Center>
            </Box>
        </Center>
    )
};

export default CreateNewPasswordConfirmation;
