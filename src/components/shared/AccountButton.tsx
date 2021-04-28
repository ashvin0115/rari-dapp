import React, { useCallback } from "react";
import { useRari } from "../../context/RariContext";
import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  Button,
  Text,
  Spinner,
} from "@chakra-ui/react";

import { Row, Column, Center } from "buttered-chakra";
import DashboardBox from "./DashboardBox";

// @ts-ignore
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";

import { shortAddress } from "../../utils/shortAddress";

import { useTranslation } from "react-i18next";
import { MODAL_PROPS, ModalDivider, ModalTitleWithCloseButton } from "./Modal";
import { LanguageSelect } from "./TranslateButton";

import { GlowingButton } from "./GlowingButton";
import { ClaimRGTModal } from "./ClaimRGTModal";
import { version } from "../..";

import MoonpayModal from "../pages/MoonpayModal";
import { useIsSmallScreen } from "../../hooks/useIsSmallScreen";
import { useAuthedCallback } from "../../hooks/useAuthedCallback";

export const AccountButton = React.memo(() => {
  const {
    isOpen: isSettingsModalOpen,
    onOpen: openSettingsModal,
    onClose: closeSettingsModal,
  } = useDisclosure();

  const authedOpenSettingsModal = useAuthedCallback(openSettingsModal);

  const {
    isOpen: isClaimRGTModalOpen,
    onOpen: openClaimRGTModal,
    onClose: closeClaimRGTModal,
  } = useDisclosure();

  const authedOpenClaimRGTModal = useAuthedCallback(openClaimRGTModal);

  const {
    isOpen: isMoonpayModalOpen,
    onOpen: openMoonpayModal,
    onClose: closeMoonpayModal,
  } = useDisclosure();

  const authedOpenMoonpayModal = useAuthedCallback(openMoonpayModal);

  return (
    <>
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={closeSettingsModal}
        openClaimRGTModal={openClaimRGTModal}
        openMoonpayModal={openMoonpayModal}
      />
      <ClaimRGTModal
        isOpen={isClaimRGTModalOpen}
        onClose={closeClaimRGTModal}
      />
      <MoonpayModal isOpen={isMoonpayModalOpen} onClose={closeMoonpayModal} />
      <Buttons
        openModal={authedOpenSettingsModal}
        openClaimRGTModal={authedOpenClaimRGTModal}
        openMoonpayModal={authedOpenMoonpayModal}
      />
    </>
  );
});

const Buttons = ({
  openModal,
  openClaimRGTModal,
  openMoonpayModal,
}: {
  openModal: () => any;
  openClaimRGTModal: () => any;
  openMoonpayModal: () => any;
}) => {
  const { address, isAuthed, login, isAttemptingLogin } = useRari();

  const { t } = useTranslation();

  const isMobile = useIsSmallScreen();

  const handleAccountButtonClick = useCallback(() => {
    if (isAuthed) {
      openModal();
    } else login();
  }, [isAuthed, login, openModal]);

  return (
    <>
      {isMobile ? null : (
        <>
          <DashboardBox
            as="button"
            flexShrink={0}
            width="110px"
            height="40px"
            fontWeight="bold"
            onClick={openMoonpayModal}
          >
            <Center expand>{t("Buy Crypto")}</Center>
          </DashboardBox>

          <DashboardBox
            ml={4}
            as="button"
            height="40px"
            flexShrink={0}
            width="98px"
            onClick={openClaimRGTModal}
            fontWeight="bold"
          >
            <Center expand>{t("Claim RGT")}</Center>
          </DashboardBox>
        </>
      )}

      {/* Connect + Account button */}
      <DashboardBox
        ml={{ md: 4, base: 0 }}
        as="button"
        height="40px"
        flexShrink={0}
        flexGrow={0}
        width="140px"
        onClick={handleAccountButtonClick}
      >
        <Row
          expand
          mainAxisAlignment="space-around"
          crossAxisAlignment="center"
          px={3}
        >
          {/* Conditionally display Connect button or Account button */}
          {!isAuthed ? (
            isAttemptingLogin ? (
              <Spinner />
            ) : (
              <Text fontWeight="semibold"> Connect </Text>
            )
          ) : (
            <>
              <Jazzicon diameter={23} seed={jsNumberForAddress(address)} />
              <Text ml={2} fontWeight="semibold">
                {shortAddress(address)}
              </Text>
            </>
          )}
        </Row>
      </DashboardBox>
    </>
  );
};

export const SettingsModal = ({
  isOpen,
  onClose,
  openClaimRGTModal,
  openMoonpayModal,
}: {
  isOpen: boolean;
  onClose: () => any;
  openClaimRGTModal: () => any;
  openMoonpayModal: () => any;
}) => {
  const { t } = useTranslation();

  const { login, logout } = useRari();

  const onSwitchWallet = () => {
    onClose();
    setTimeout(() => login(), 100);
  };

  const handleDisconnectClick = () => {
    onClose();
    logout();
  };

  const onClaimRGT = () => {
    onClose();
    setTimeout(() => openClaimRGTModal(), 100);
  };

  return (
    <Modal
      motionPreset="slideInBottom"
      isOpen={isOpen}
      onClose={onClose}
      isCentered
    >
      <ModalOverlay />
      <ModalContent {...MODAL_PROPS}>
        <ModalTitleWithCloseButton text={t("Account")} onClose={onClose} />

        <ModalDivider />

        <Column
          width="100%"
          mainAxisAlignment="flex-start"
          crossAxisAlignment="center"
          p={4}
        >
          <GlowingButton
            label={t("Claim RGT")}
            onClick={onClaimRGT}
            width="100%"
            height="51px"
            mb={4}
          />

          <Button
            bg="facebook.500"
            width="100%"
            height="45px"
            fontSize="xl"
            borderRadius="7px"
            fontWeight="bold"
            onClick={openMoonpayModal}
            _hover={{}}
            _active={{}}
            mb={4}
          >
            {t("Buy Crypto")}
          </Button>

          <Button
            bg={"whatsapp.500"}
            width="100%"
            height="45px"
            fontSize="xl"
            borderRadius="7px"
            fontWeight="bold"
            onClick={onSwitchWallet}
            _hover={{}}
            _active={{}}
            mb={4}
          >
            {t("Switch Wallet")}
          </Button>

          <Button
            bg="red.500"
            width="100%"
            height="45px"
            fontSize="xl"
            borderRadius="7px"
            fontWeight="bold"
            onClick={handleDisconnectClick}
            _hover={{}}
            _active={{}}
            mb={4}
          >
            {t("Disconnect")}
          </Button>

          <LanguageSelect />

          <Text mt={4} fontSize="10px">
            Version {version}
          </Text>
        </Column>
      </ModalContent>
    </Modal>
  );
};
