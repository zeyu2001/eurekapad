import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from '@react-email/components'
import * as React from 'react'

interface ShareWithUserEmailProps {
  email: string
  invitedByName: string
  invitedByEmail: string
  isEditor: boolean
  documentName: string
  inviteLink: string
  invitedByImage?: string
}

const baseUrl = 'https://www.eurekapad.app'

export const ShareWithUserEmail = ({
  email,
  invitedByName,
  invitedByEmail,
  isEditor,
  documentName,
  invitedByImage,
  inviteLink,
}: ShareWithUserEmailProps) => {
  const previewText = `You have been invited to collaborate on ${documentName}`

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="m-auto bg-white px-2 font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Section className="mt-[32px]">
              <Img src={`${baseUrl}/favicon.ico`} width="40" height="40" alt="Logo" className="mx-auto my-0" />
            </Section>
            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
              Join <strong>{invitedByName}</strong> on <strong>EurekaPad</strong>
            </Heading>
            <Section>
              <Row>
                <Column className="items-center">
                  <Img className="rounded-full" src={invitedByImage} width="40" height="40" alt={invitedByName} />
                </Column>
                <Column className="flex-1 pl-[16px]">
                  <Text className="text-[14px] leading-[24px] text-black">
                    <strong>{invitedByName}</strong> (
                    <Link href={`mailto:${invitedByEmail}`} className="text-blue-600 no-underline">
                      {invitedByEmail}
                    </Link>
                    ) has invited you to <strong>{isEditor ? 'edit' : 'view'}</strong> the document{' '}
                    <strong>{documentName}</strong> on <strong>EurekaPad</strong>.
                  </Text>
                </Column>
              </Row>
            </Section>
            <Section className="my-[32px] text-center">
              <table
                align="center"
                border={0}
                cellPadding="0"
                cellSpacing="0"
                className="my-[16px] h-[324px] rounded-[12px] bg-[#2563EB]"
                role="presentation"
                width="100%"
              >
                <tbody>
                  <tr>
                    <td align="center" className="p-[40px] text-center">
                      <Text className="m-0 font-semibold text-gray-200">Shared with you</Text>
                      <Heading as="h1" className="m-0 mt-[4px] font-bold text-white">
                        {documentName}
                      </Heading>
                      <Text className="m-0 mt-[8px] text-[16px] leading-[24px] text-white">
                        {isEditor
                          ? 'You can edit this document and invite others to collaborate'
                          : 'You can view this document'}
                      </Text>
                      <Button
                        className="mt-[24px] rounded-[8px] border border-solid border-gray-200 bg-white px-[40px] py-[12px] font-semibold text-gray-900"
                        href={inviteLink}
                      >
                        Open
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Section>
            <Text className="text-[14px] leading-[24px] text-black">
              or copy and paste this URL into your browser:{' '}
              <Link href={inviteLink} className="text-blue-600 no-underline">
                {inviteLink}
              </Link>
            </Text>
            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
            <Text className="text-[12px] leading-[24px] text-[#666666]">
              This invitation was intended for <span className="text-black">{email}</span>. If you were not expecting
              this invitation, you can ignore this email. If you are concerned about your account&apos;s safety, please
              reply to this email to get in touch with us.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

export default ShareWithUserEmail
