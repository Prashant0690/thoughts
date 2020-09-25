import React from 'react';
import { CopyBlock, monoBlue } from "react-code-blocks";

function TddNotebook() {
    return (
        <div className="container">
            <h2>Test driven development textbook </h2>
            <p>Test driven development is not new but as technology is progressing there has been a change in software development process and TDD has gain popularity and embraced by Companies at large. Few factors which have effected this change are ease of integrating dynamically changing requirements, bug fix and application changes are quick and finally my favorite low tech-depth with clean code.</p>
            <p>For many years I too tried to understand this new power just by thinking and trying to answer how... how to write a test before the code and felt clueless. Only recently I have the time and people to help me move in this direction. I have documented a small POC project that might help few developers in this learning process. Also, might help few to understand, with little time and effort test driven development possible for every piece of code. Hope this will be helpful to few.</p>
            <blockquote>Developer super power => Red -> Green -> Refactor</blockquote>
            <blockquote>Think first=> Assemble -- Act – Assert</blockquote>
            <h3>Important points I like to share which will be reflected in my code below which can help in strong TDD foundation:</h3>
            <ul>
                <li>Whenever using mock try passing the actual expected values instead of using matchers like (any,  anyString, anyList, etc) unless you have a string reason to do so, as passing actual data to mock method is a kind of code verification/code assertion.</li>
                <li>Always verify your test case hypotheses by checking everything like assertions, method call verification, exceptions verification.</li>
                <li>Once green try to change code and make your test case fail for every scenario it's expected to fail that will help in deeper understanding and strong test case verification.</li>
            </ul>
            <div style={{ fontFamily: 'Fira Code', textAlign: 'left' }}>
                <CopyBlock
                    text={code}
                    language={'java'}
                    showLineNumbers={false}
                    theme={monoBlue}
                    wrapline
                />
            </div>
        </div>
    )
}

let code = `


/*Creating mock bean with a mock method call for testing init/lifecycle methods  */
@ExtendWith(SpringExtension.class)
@ContextConfiguration(classes = {PublishMsgTokenApiImplTest.MockBeanConfiguration.class})
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class PublishMsgTokenApiImplTest implements CommDataSet {
    @Configuration
    public static class MockBeanConfiguration implements CommDataSet {
        @Autowired
        private PublishApiConfig publishApiConfig;

        @Bean
        public RestTemplate createRestTemplate() {
            RestTemplate restTemplate = mock(RestTemplate.class);
            HttpEntity<TokenRequest> entity = getTokenRequestHttpEntity(publishApiConfig);
            ResponseEntity<TokenResponse> responseEntity = getTokenResponseResponseEntity();
            when(restTemplate.exchange(eq(publishApiConfig.getTokenUrl()), eq(HttpMethod.POST), eq(entity), eq(TokenResponse.class)))
                    .thenReturn(responseEntity);
            return restTemplate;
        }

    }

    @Test
    @Order(1)
    void test_init_method_loadToken() {
        verify(restTemplate, times(1))
                .exchange(eq(publishApiConfig.getTokenUrl()), eq(HttpMethod.POST), any(), eq(TokenResponse.class));
    }

    /*Executing same mock method multiple time on a same test with different responses like Expetions Generic method the code is in the rest template mocking also for retry*/
    @Test
    void test_update_method_Success_With_Retry() {
        //Assemble
        HttpEntity<TokenRequest> entity = getTokenRequestHttpEntity(publishApiConfig);
        TokenResponse tokenRequestNew = new TokenResponse("new-access-token-retry", TOKEN_TYPE, EXPIRES_IN);
        ResponseEntity<TokenResponse> responseEntity = new ResponseEntity<>(tokenRequestNew, HttpStatus.OK);
        when(restTemplate.exchange(eq(publishApiConfig.getTokenUrl()), eq(HttpMethod.POST), eq(entity), eq(TokenResponse.class)))
                .thenAnswer(invocationOnMock -> {
                    if (INNVOCATION_COUNT == 0 || INNVOCATION_COUNT == 1) {
                        INNVOCATION_COUNT++;
                        HttpHeaders headers = new HttpHeaders();
                        throw new RestClientResponseException("Rest exp", 403, "Forbidden", headers, null, null);
                    }
                    return responseEntity;
                });
        //ACT
        publishMsgTokenApi.updateToken();
        //Assert
        assertEquals("new-access-token-retry", publishMsgTokenApi.getAccessToken());
        verify(restTemplate, times(3))
                .exchange(eq(publishApiConfig.getTokenUrl()), eq(HttpMethod.POST), any(), eq(TokenResponse.class));
    }

    //Verify everything not just exception to prove you test hypothies is correct.
    @Test
    void test_publishMessage_return_401Unauthorized_UpdateToken_PublishMsg_re_return_401_Failure() {
        //Assemble
        HttpEntity<DisplayMsgRequest> entity = new HttpEntity<>(getDisplayMsgRequest(), getHttpHeadersPublishMsgApi());

        when(restTemplate.exchange(eq(publishApiConfig.getPublishApiUrl()), eq(HttpMethod.POST), eq(entity), eq(DisplayMessage.class)))
                .thenThrow(new RestClientResponseException(UNAUTHORIZED_MSG, UNAUTHORIZED_STATUS_CODE, UNAUTHORIZED_STATUS_TXT, getUnauthorizedHeader(), null, null));
        //Act
        RestClientResponseException response = assertThrows(RestClientResponseException.class,
                () -> publishMsgApiService.publishNewMsg(getDisplayMsgRequest()));
        //Assert
        assertEquals(UNAUTHORIZED_STATUS_CODE, response.getRawStatusCode());
        verify(restTemplate, times(2))
                .exchange(eq(publishApiConfig.getPublishApiUrl()),
                        eq(HttpMethod.POST),
                        eq(entity), eq(DisplayMessage.class));
        verify(publishMsgTokenApi, times(2)).getAccessToken();
        verify(publishMsgTokenApi, times(1)).updateToken();
    }
}


`;


export default TddNotebook;