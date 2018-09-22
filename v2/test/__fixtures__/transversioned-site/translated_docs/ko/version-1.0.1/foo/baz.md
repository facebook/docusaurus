---
id: version-1.0.1-baz
title: baz
---

## 이미지

링크와 마찬가지로 이미지에도 각주 스타일 구문이 있습니다.

! [Alt text] [id]

나중에 URL 위치를 정의하는 문서에서 참조로 :

[id] : https://octodex.github.com/images/dojocat.jpg "The Dojocat"

## 링크

[링크 텍스트] (http://dev.nodeca.com)

[제목 링크] (http://nodeca.github.io/pica/demo/ "제목 텍스트!")

자동 변환 된 링크 https://github.com/nodeca/pica (linkify를 사용하도록 설정)



## 각주

각주 1 링크 [^ 첫 번째].

각주 2 링크 [^ 초].

인라인 각주 ^ [인라인 각주의 텍스트] 정의.

중복 된 각주 참조 [^ 초].

[^ first] : 각주 **는 마크 업을 가질 수 있습니다 **

    및 여러 단락.

[^ 초] : 각주 텍스트.


## 정의 목록

1 학기

정의 1
게으른 연속.

* 인라인 마크 업과 함께 2 학기 *

: 정의 2

        {일부 코드, 정의 2의 일부}

    정의의 세 번째 단락 2.

_ 컴팩트 스타일 : _

1 학기
  ~ 정의 1

2 학기
  ~ 정의 2a
  ~ 정의 2b


## 약어

이것은 HTML 약어입니다.

그것은 "HTML"을 변환하지만 "xxxHTMLyyy"와 같이 부분적인 항목을 그대로 유지합니다.

* [HTML] : 하이퍼 텍스트 마크 업 언어