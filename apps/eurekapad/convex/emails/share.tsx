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
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Section className="mt-[32px]">
              <Img src={`${baseUrl}/favicon.ico`} width="40" height="40" alt="Logo" className="my-0 mx-auto" />
            </Section>
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              Join <strong>{invitedByName}</strong> on <strong>EurekaPad</strong>
            </Heading>
            <Section>
              <Row>
                <Column className="items-center">
                  <Img className="rounded-full" src={invitedByImage} width="40" height="40" alt={invitedByName} />
                </Column>
                <Column className="flex-1 pl-[16px]">
                  <Text className="text-black text-[14px] leading-[24px]">
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
            <Section className="text-center mt-[32px] mb-[32px]">
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
            <Text className="text-black text-[14px] leading-[24px]">
              or copy and paste this URL into your browser:{' '}
              <Link href={inviteLink} className="text-blue-600 no-underline">
                {inviteLink}
              </Link>
            </Text>
            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            <Text className="text-[#666666] text-[12px] leading-[24px]">
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
