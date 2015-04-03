# RETS

RETSr.io rets.js RETS Client



* * *

### RETS.login(url) 

Execute login action/capability against RETS service.

**Parameters**

**url**: `string | object`, A compliant URL string or URL module compatible url object.



### RETS.logout() 

Execute logout action/capability against RETS service.



### RETS.getMetadata(options, options.type, options.id, options.format) 

Execute GetMetadata action/capability against RETS service.

**Parameters**

**options**: `Object`, GetMetadata Request Options:

**options.type**: `string`, Metadata types can be:
                        METADATA-LOOKUP, METADATA-LOOKUP_TYPE, METADATA-FOREIGN_KEY, METADATA-FILTER, 
                        METADATA-FILTER_TYPE, METADATA-RESOURCE, METADATA-CLASS, METADATA-OBJECT, 
                        METADATA-TABLE, METADATA-SYSTEM, METADATA-UPDATE, METADATA-UPDATE_TYPE, 
                        METADATA-SEARCH_HELP, etc.

**options.id**: `string`, Resource ID to lookup

**options.format**: `string`, XML-Standard



### RETS.getObject(options, options.resource, options.type, options.id, options.location) 

Execute GetObject action/capability against RETS service.

**Parameters**

**options**: `Object`, GetObject Request Options

**options.resource**: `string`, Resource identifier

**options.type**: `string`, Object type

**options.id**: `string`, Related record id

**options.location**: `bool`, Return binary or as URL



### RETS.search(options, options.SearchType, options.Class, options.Query, options.QueryType, options.Count, options.Format, optionsLimit, options.StandardNames) 

Execute search action/capability against RETS service.

**Parameters**

**options**: `Object`, A compliant URL string or URL module compatible url object.

**options.SearchType**: `string`, Resource to search against

**options.Class**: `string`, Class to search against

**options.Query**: `string`, DMQL(2) query

**options.QueryType**: `string`, Specify DMQL or DMQL2 query

**options.Count**: `Number`, Boolean; should the server return a record count

**options.Format**: `String`, Data format type COMPACT, COMPACT-DECODED or STANDARD-XML

**optionsLimit**: `Number`, Record limit to fetch

**options.StandardNames**: `Number`, Boolean to return fields as StandardNames




* * *










