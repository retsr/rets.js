module.exports = {
    "name": "Mock Server",
    "config": {
        "url": "http://user:pass@rets.server.com:9160/Login.asmx/Login",
        "userAgent": "RETS-Connector1/2",
        "userAgentPassword": "",
    },
    "capabilities": {
        "Login": {
            "path": "/Login.asmx/Login",
            "success": [
                "<RETS ReplyCode=\"0\" ReplyText=\"Operation Successful\" >",
                "<RETS-RESPONSE>",
                "MemberName=John Doe",
                "User=user,0,IDX Vendor,0000RETS   00",
                "Broker=00,0",
                "MetadataVersion=03.08.00024",
                "MetadataTimestamp=2015-03-11T10:36:09",
                "MinMetadataTimestamp=2015-03-11T10:36:09",
                "TimeoutSeconds=1800",
                "GetObject=/njs/GetObject",
                "Login=/njs/Login",
                "Logout=/njs/Logout",
                "Search=/njs/Search",
                "GetMetadata=/njs/GetMetadata",
                "</RETS-RESPONSE>",
                "</RETS>"
            ].join("\n"),
            "failure": [
                "<RETS ReplyCode=\"20807\" ReplyText=\"Unauthorized\" >",
                "</RETS>"
            ].join("\n")
        },
        "GetObject": {
            "path": "/njs/GetObject",
            "success": [],
            "failure": []
        },
        "GetMetadata": {
            "path": "/njs/GetMetadata",
            "success": [
                "<RETS ReplyCode=\"0\" ReplyText=\"Operation Successful\">",
                "<METADATA>",
                    "<METADATA-RESOURCE Date=\"2015-03-11T12:37:12\" Version=\"1.00.00010\">",
                        "<Resource>",
                            "<ResourceID>Property</ResourceID>",
                            "<StandardName/>",
                            "<VisibleName>Property</VisibleName>",
                            "<Description>Property</Description>",
                            "<KeyField>ListingKey</KeyField>",
                            "<ClassCount>7</ClassCount>",
                            "<ClassVersion>1.00.00006</ClassVersion>",
                            "<ClassDate>2014-12-15T09:29:58</ClassDate>",
                            "<ObjectVersion>1.00.00000</ObjectVersion>",
                            "<ObjectDate>2014-06-20T11:32:55</ObjectDate>",
                            "<SearchHelpVersion>1.00.00000</SearchHelpVersion>",
                            "<SearchHelpDate>2014-06-20T11:32:55</SearchHelpDate>",
                            "<EditMaskVersion>1.00.00000</EditMaskVersion>",
                            "<EditMaskDate>2014-06-20T11:32:55</EditMaskDate>",
                            "<LookupVersion>1.00.00002</LookupVersion>",
                            "<LookupDate>2014-12-15T09:29:58</LookupDate>",
                            "<UpdateHelpVersion>1.00.00000</UpdateHelpVersion>",
                            "<UpdateHelpDate>2014-06-20T11:32:55</UpdateHelpDate>",
                            "<ValidationExpressionVersion>1.00.00000</ValidationExpressionVersion>",
                            "<ValidationExpressionDate>2014-06-20T11:32:55</ValidationExpressionDate>",
                            "<ValidationLookupVersion>1.00.00000</ValidationLookupVersion>",
                            "<ValidationLookupDate>2014-06-20T11:32:55</ValidationLookupDate>",
                            "<ValidationExternalVersion>1.00.00000</ValidationExternalVersion>",
                            "<ValidationExternalDate>2014-06-20T11:32:55</ValidationExternalDate>",
                        "</Resource>",
                    "</METADATA-RESOURCE>",
                "</METADATA>",
                "</RETS>",
            ],
            "failure": []
        },
        "Search": {
            "path": "/njs/Search",
            "success": [],
            "failure": []
        },
        "Logout": {
            "path": "/njs/Logout",
            "success": [
                "<RETS ReplyCode=\"0\" ReplyText=\"Operation Successful\" >",
                "<RETS-RESPONSE>",
                "ConnectTime=0 minutes",
                "SignOffMessage=Logged out.",
                "</RETS-RESPONSE>",
                "</RETS>",
            ].join("\n"),
            "failure": []
        }
    }
};
