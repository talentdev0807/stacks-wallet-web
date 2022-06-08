import { Box, Button, color, Flex, Text } from '@stacks/ui';
import LedgerTxRejected from '@assets/images/ledger/transaction-rejected.png';
import { LedgerTitle } from '../components/ledger-title';

interface LedgerOperationRejectedLayoutProps {
  description: string;
  onClose(): void;
}
export function LedgerOperationRejectedLayout({
  onClose,
  description,
}: LedgerOperationRejectedLayoutProps) {
  return (
    <Flex alignItems="center" flexDirection="column" pb="extra-loose" px="loose" textAlign="center">
      <Box>
        <img src={LedgerTxRejected} width="227px" height="63px" />
      </Box>
      <LedgerTitle mt="extra-loose" mx="40px" lineHeight="1.6">
        {description}
      </LedgerTitle>
      <Text mt="base-tight" lineHeight="24px" color={color('text-caption')}></Text>
      <Button mode="tertiary" mt="base" mr="base-tight" mb="tight" onClick={onClose}>
        Close
      </Button>
    </Flex>
  );
}
