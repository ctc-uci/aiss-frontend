import { Button, Center, Link, Box, Heading, Text} from '@chakra-ui/react';

const ForgotPasswordConfirmation = () => {
    return (
        <Box>
            <Center h="90vh">
                <Box
                style={{
                    margin: 'auto',
                    textAlign: 'center',
                    width: '598px',
                    minWidth: '300px',
                }}
                >
                    <Heading as='h1' size='lg'>Instructions Sent</Heading>
                    <Text as='h2' size='md' mt={2}>Please check inbox for password reset instructions.</Text>
                    <Link href="/login">
                        <Button mt={5}
                            type="submit"
                            style={{
                            borderRadius: '30px',
                            marginLeft: '16px',
                            paddingLeft: '80px',
                            paddingRight: '80px',
                            width: '140px',
                            height: '38px',
                            }}
                            backgroundColor={'#243268'}
                            color={'#ffffff'}
                            _hover={{backgroundColor: '#1A2559'}}
                        >
                        Return to Login
                        </Button>
                    </Link>
                </Box>
            </Center>
        </Box>
    );
};

export default ForgotPasswordConfirmation;
