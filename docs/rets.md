# RETS

RETSr.io rets.js RETS Client



* * *

### RETS.login(url) 

Execute login action/capability against RETS service.

**Parameters**

**url**: `string | object`, A compliant URL string or URL module compatible url object.



### RETS.logout() 

Execute logout action/capability against RETS service.



### RETS.getMetadata(type, id, format) 

Execute GetMetadata action/capability against RETS service.

**Parameters**

**type**: `string`, Metadata types can be:
                        METADATA-LOOKUP, METADATA-LOOKUP_TYPE, METADATA-FOREIGN_KEY, METADATA-FILTER, 
                        METADATA-FILTER_TYPE, METADATA-RESOURCE, METADATA-CLASS, METADATA-OBJECT, 
                        METADATA-TABLE, METADATA-SYSTEM, METADATA-UPDATE, METADATA-UPDATE_TYPE, 
                        METADATA-SEARCH_HELP, etc.

**id**: `string`, Resource ID to lookup

**format**: `string`, XML-Standard



### RETS.getObject(resource, type, id, location) 

Execute GetObject action/capability against RETS service.

**Parameters**

**resource**: `string`, Resource identifier

**type**: `string`, Object type

**id**: `string`, Related record id

**location**: `boolean`, Return binary or as URL



### RETS.search(query, options) 

Execute search action/capability against RETS service.

**Parameters**

**query**: `Object`, A compliant URL string or URL module compatible url object.

**options**: `Object`, A compliant URL string or URL module compatible url object.




* * *










