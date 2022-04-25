
envPattern = /env\/envs(\/([\w-]*))*\/[\b(service|history)\b]/

tcePattern = /env\/psm(\/([\w-]*))*\/tce\/deploy/

servicePattern = /tce\/services(\/([\w-]*))*/

scmPattern = /scm\/detail/

interfaceTestPattern = /neptune\/interfaceTest\?/

passPattern = /pass[\w.]*\/idl_info/

janusPattern = /https:\/\/janus/

argosPattern = /argos(\/([^?\/]*))*/

tccPattern=/tcc\/detail/

cronJobPattern=/https:\/\/[^\/]*\/cronjob/

urlQueryPattern = /([^&=?]+)=([^&]*)/
match = undefined


patternRuleMap = new Map([
    [envPattern, function () {
        return "ENV-" + match[match.length - 1]
    },],
    [tcePattern, function () {
        return "SRV-" + match[match.length - 1]
    }],
    [servicePattern, function () {
        return document.title.replace("云引擎", "TCE").replace("- 字节云", "")
    }],
    [scmPattern, function () {
        let tryTimes = 5
        let cancel = setTimeout(() => {
            let eles = document.getElementsByClassName("scm-detail_name__1KOSZ")
            if (eles === undefined || eles.length === 0) {
                tryTimes--
                tryTimes === 0 && clearTimeout(cancel)
                return
            }
            document.title = "SCM-" + eles[0].innerText
            clearTimeout(cancel)
        }, 2000)
        return ""
    }],
    [interfaceTestPattern, function () {
        let map = getQueryKVMapFromUrl()
        let func = map.get("_func_name") || ""
        func && (func += "-")
        let psm = map.get("_psm") || ""
        return func + psm+" - InterfaceTest"
    }],
    [passPattern, function () {
        let map = getQueryKVMapFromUrl()
        let search = map.get("s") || ""
        search && (search += "-overpass")
        return search
    }],
    [janusPattern, function () {
        let tryTimes = 5
        let cancel = setTimeout(() => {
            let eles = document.getElementsByClassName("ant-breadcrumb-link")
            if (eles === undefined || eles.length <= 1) {
                tryTimes--
                tryTimes === 0 && clearTimeout(cancel)
                return
            }
            document.title = eles[1].innerText + " - janus"
            clearTimeout(cancel)
        }, 2000)
    }],
    [argosPattern, function () {
        let tryTimes = 5
        let map = getQueryKVMapFromUrl()
        let psm = map.get("psm") || ""
        let cancel = setTimeout(() => {
            let eles = document.getElementsByClassName("arco-breadcrumb-item")
            if (eles === undefined || eles.length === 0) {
                tryTimes--
                tryTimes === 0 && clearTimeout(cancel)
                return
            }
            document.title = (eles[1] || eles[0]).innerText + (psm ? "-" + psm : "")
            clearTimeout(cancel)
        }, 2000)
    }],
    [tccPattern,function () {
        let tryTimes = 5
        let cancel = setTimeout(() => {
            let eles = document.getElementsByClassName("ivu-tooltip-rel")
            if (eles === undefined || eles.length <1) {
                tryTimes--
                tryTimes === 0 && clearTimeout(cancel)
                return
            }
            document.title ="TCC - "+ eles[0].innerText
            clearTimeout(cancel)
        }, 2000)
    }],
    [cronJobPattern,function () {
        let tryTimes = 5
        let cancel = setTimeout(() => {
            let eles = document.getElementsByClassName("components_psmOuter__RGZOE")
            if (eles === undefined || eles.length <1) {
                tryTimes--
                tryTimes === 0 && clearTimeout(cancel)
                return
            }
            document.title ="Cronjob - "+ eles[0].innerText
            clearTimeout(cancel)
        }, 2000)
    }]
])

url = document.URL
for (let [pattern, func] of patternRuleMap) {
    match = url.match(pattern)
    let title
    if (match) {
        (title = func()) && (document.title = title)
        break
    }
}

function getQueryKVMapFromUrl() {
    let map = new Map()
    let query = window.location.search.substring(1)
    let kvs = query.split("&")
    for (let i = 0; i < kvs.length; i++) {
        let kv = kvs[i].split("=")
        map.set(kv[0], kv[1])
    }
    return map
}

