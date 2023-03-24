const redirects = new Map<string, string>([
  ["20230110_mysql_check_constraint", "/articles/2023/1/0110_mysql_check_constraint"],
  ["20220918_go_faq", "/articles/2022/9/0918_go_faq"],
  ["20220321_cpaw_q21_writeup","/articles/2022/3/0321_cpaw_q21_writeup"],
  ["20220225_twilioug-vol5","/articles/2022/2/0225_twilioug-vol5"],
  ["20220213_colab_mount_drive","/articles/2022/2/0213_colab_mount_drive"],
  ["20220205_python_ipython_jupyter","/articles/2022/2/0205_python_ipython_jupyter"],
  ["20220117_glue3_local","/articles/2022/1/0117_glue3_local"],
  ["20220110_movie_asakusa_kid","/articles/2022/1/0110_movie_asakusa_kid"],
  ["20220102_book_deep_learning","/articles/2022/1/0102_book_deep_learning"],
  ["20210923_speech_recognition_acuracy","/articles/2021/9/0923_speech_recognition_acuracy"],
  ["20210923_julius_tutorial","/articles/2021/9/0923_julius_tutorial"],
  ["20210801_jyp_book","/articles/2021/8/0801_jyp_book"],
  ["20210524_read_book_1","/articles/2021/5/0524_read_book_1"],
  ["20210514_go_embed","/articles/2021/5/0514_go_embed"],
  ["20211212_look_back_on_last_year","/articles/2021/12/1212_look_back_on_last_year"],
  ["20211106_fuzz_testing", "/articles/2021/11/1106_fuzz_testing"],
  ["20211119_cognito_jwt_verification","/articles/2021/11/1119_cognito_jwt_verification"],
  ["20211112_cognito_user_migration","/articles/2021/11/1112_cognito_user_migration"],
  ["20211021_mfa_required_credentials","/articles/2021/10/1021_mfa_required_credentials"],
  ["20211007_cdk_golang", "/articles/2021/10/1007_cdk_golang"],
  ["20210111_look_back_on_last_year", "/articles/2021/1/0111_look_back_on_last_year"],
  ["20210104_ddd_tutorial_book", "/articles/2021/1/0104_ddd_tutorial_book"],
  ["20201218_golang_twiml", "/articles/2020/12/1218_golang_twiml"],
  ["20201205_golang_di_wire", "/articles/2020/12/1205_golang_di_wire"],
  ["20201129_bazel_golang_tutorial1", "/articles/2020/11/1129_bazel_golang_tutorial1"],
  ["20201115_mysql_column_detail", "/articles/2020/11/1115_mysql_column_detail"],
  ["20201109_study_of_sql", "/articles/2020/11/1109_study_of_sql"],
  ["20201102", "/articles/2020/11/1102"],
  ["20201101", "/articles/2020/11/1101"],
])

export default defineNuxtRouteMiddleware((to, from) => {
  for (const [src, dst] of redirects) {
    if (to.path.indexOf(src) != -1) {
      return navigateTo(dst)
    }
  }
})
