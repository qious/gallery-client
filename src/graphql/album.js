import gql from 'graphql-tag'

export default gql`query Albums($path: String!, $answers: [AnswerInput]) {
  album(path: $path, answers: $answers) {
    name
    description
    questions {
      path
      question
    }
    images {
      path
      name
      meta {
        width
        height
        frames
        type
        EXIF {
          Model
          FNumber
          ShutterSpeedValue
          ISOSpeedRatings
          DateTimeOriginal
        }
      }
      url {
        original
        thumbnail
      }
    }
    albums {
      path
      name
      questions {
        path
        question
      }
      thumbnails
    }
  }
}`