#!/bin/perl

# --------------------------------------------------------
# 定数定義
# --------------------------------------------------------
$RET_OK = 0;						# 正常
$RET_NG = -1;						# 異常

$FIRST_MAKE			= 1;			# 初回作成
$ADD_MAKE			= 2;			# 継続作成

$NUM_MINSIZE		= 0;			# 汎用数値最低設定値
$OBJECT_MINSIZE		= -12.5;		# オブジェクト汎用最小値
$OBJECT_MAXSIZE		= 12.5;			# オブジェクト汎用最大値

$OBJECT_SET_FILENAME	= "";		# オブジェクトファイル名
$OBJECT_SET_X			= "";		# オブジェクト(x座標)設定値
$OBJECT_SET_Y			= "";		# オブジェクト(y座標)設定値
$OBJECT_SET_WIDTH		= "";		# オブジェクト(幅)設定値
$OBJECT_SET_HEIGHT		= "";		# オブジェクト(高さ)設定値
$OBJECT_SET_ANGLE		= "";		# オブジェクト(角度)設定値
$OBJECT_SET_ID			= "";		# オブジェクト(ID)設定値
$OBJECT_SET_TEXTURE		= "";		# オブジェクト(テクスチャー)設定値
# --------------------------------------------------------


# --------------------------------------------------------
# 関数定義
# --------------------------------------------------------
# USAGE
sub USAGE
{
	printf("ERROR: 引数誤り 引数=[%d]\n",$#ARGV+1);
	printf("INFO : ＜USAGE＞\n");
	printf("     :  %s\n",$0);
}

# 改行コード削除関数
sub DEL_CLRF
{
	$STR=@_[0];

	# CR削除
	$STR =~ s/\r//;
	# LF削除
	$STR =~ s/\n//;

	return $STR;
}

# 数値チェック関数
sub CHK_NUM
{
	$VAL = @_[0];

	# 数値チェック
	if($VAL =~ /^[a-zA-Z]+$/)
	{
		return $RET_NG;		# チェックNG
	}

	# 最大最小値チェック
	if($OBJECT_MINSIZE > $VAL)
	{
		return $RET_NG;		# チェックNG
	}

	if($VAL > @_[1])
	{
		return $RET_NG;		# チェックNG
	}

	return $RET_OK;	 		# チェックOK
}

# オブジェクト設定値設定関数
sub SET_OBJECT_VAL_CHK
{
	my $object_tmp_val;

	while(1)
	{
		printf("%s > ", @_[0]);
		# オブジェクト設定値入力
		$object_tmp_val = <STDIN>;

		# 入力値チェック
		$object_tmp_val = DEL_CLRF($object_tmp_val);
		$RET = CHK_NUM($object_tmp_val, $OBJECT_MAXSIZE);

		if($RET == $RET_OK)
		{
			last;	# 戻り値が正常のため、ループを抜ける
		}
		# 戻り値が異常の場合、再度設定させる
		printf("ERROR: RET内容=[%d]\n", $RET);

		printf("設定値に誤りがあります。 設定内容=[%s]\n", $object_tmp_val);
		printf("設定値は以下の範囲で設定してください。 (%3.1f <= 設定値 <= %3.1f)\n\n", $OBJECT_MINSIZE, $OBJECT_MAXSIZE);

		next;
	}

	return $object_tmp_val;
}

# 文字列設定内容確認
sub SET_STRINGS_CHK
{
	my $CHK_PARAM;
	printf("\n【%s設定内容確認】\n", @_[0]);
	printf("★-------------------------------★\n");
	printf("%s設定値=[%s]\n", @_[0], @_[1]);
	printf("★-------------------------------★\n\n");
	printf("上記設定内容で%sを設定します。\n設定内容に問題なければ y を入力してください。 > ", @_[0]);
	$CHK_PARAM = <STDIN>;

	if($CHK_PARAM !~ /^[yY]$/)
	{
		return $RET_NG;
	}

	return $RET_OK;
}

# オブジェクト情報設定内容確認
sub SET_OBJECT_PARAM_CHK
{
	my $CHK_PARAM;
	printf("\n【オブジェクト情報設定内容確認】\n");
	printf("★-------------------------------★\n");
	printf("オブジェクト(x座標)設定値          =[%3.1f]\n", @_[0]);
	printf("オブジェクト(y座標)設定値          =[%3.1f]\n", @_[1]); 
	printf("オブジェクト(幅)設定値             =[%3.1f]\n", @_[2]); 
	printf("オブジェクト(高さ)設定値           =[%3.1f]\n", @_[3]); 
	printf("オブジェクト(角度)設定値           =[%3.1f]\n", @_[4]); 
	printf("オブジェクト(ID)設定値             =[%s]\n", @_[5]); 
	printf("オブジェクト(テクスチャー)設定値   =[%s]\n", @_[6]); 
	printf("\n※ 表示上、小数点第一位までしか表示していませんが、ファイルには入力した値が出力されます。\n");
	printf("★-------------------------------★\n\n");
	printf("上記設定内容でオブジェクトを作成します。\n設定内容に問題なければ y を入力してください。 > ");
	$CHK_PARAM = <STDIN>;

	if($CHK_PARAM !~ /^[yY]$/)
	{
		return $RET_NG;
	}

	return $RET_OK;
}

# オブジェクト情報ファイル作成処理
sub MAKE_OBJECT_FILE
{
	$make_object_flg		= @_[0];
	$make_object_file_name	= $OBJECT_SET_FILENAME;
	$make_object_val		= "";

	if($make_object_flg == $FIRST_MAKE)
	{
		open(FD, ">$make_object_file_name");

		# ファイル先頭行出力
		printf(FD "\[\n");
	}
	else
	{
		open(FD, ">>$make_object_file_name");
		# オブジェクト情報区切り改行出力
		printf(FD ",\n");
	}

	# オブジェクトマップ情報文字列作成
	$make_object_val = "\t\{" . "\"x\":" . $OBJECT_SET_X . ", " . "\"y\":" . $OBJECT_SET_Y . ", " . 
						"\"w\":" . $OBJECT_SET_WIDTH . ", " . "\"h\":" . $OBJECT_SET_HEIGHT . ", " .
						"\"angle\":" . $OBJECT_SET_ANGLE . ", " . "\"id\":" . $OBJECT_SET_ID . ", " .
						"\"texture\":" . $OBJECT_SET_TEXTURE . "\"\}";

	printf(FD "%s", $make_object_val);

	close(FD);
}

# オブジェクト情報ファイル作成処理
sub MAKE_OBJECT_STR
{
	# オブジェクト情報定義
	printf("【オブジェクト情報定義】\n");

	while(1)
	{
		# オブジェクト(x座標)設定
		$OBJECT_SET_X = SET_OBJECT_VAL_CHK("オブジェクト(x座標)を設定してください ");
		printf("オブジェクト(x座標)=[%3.1f]\n", $OBJECT_SET_X);

		# オブジェクト(y座標)設定
		$OBJECT_SET_Y = SET_OBJECT_VAL_CHK("オブジェクト(y座標)を設定してください ");
		printf("オブジェクト(y座標)=[%3.1f]\n", $OBJECT_SET_Y);

		# オブジェクト(幅)設定
		$OBJECT_SET_WIDTH = SET_OBJECT_VAL_CHK("オブジェクト(幅)を設定してください ");
		printf("オブジェクト(幅)=[%3.1f]\n", $OBJECT_SET_WIDTH);

		# オブジェクト(高さ)設定
		$OBJECT_SET_HEIGHT = SET_OBJECT_VAL_CHK("オブジェクト(高さ)を設定してください ");
		printf("オブジェクト(高さ)=[%3.1f]\n", $OBJECT_SET_HEIGHT);

		# オブジェクト(角度)設定
		$OBJECT_SET_ANGLE = SET_OBJECT_VAL_CHK("オブジェクト(角度)を設定してください ");
		printf("オブジェクト(角度)=[%3.1f]\n", $OBJECT_SET_ANGLE);

		# オブジェクト(ID)設定
		while(1)
		{
			printf("オブジェクト(ID)を設定してください。 > ");
			$OBJECT_SET_ID = <STDIN>;
			$OBJECT_SET_ID = DEL_CLRF($OBJECT_SET_ID);

			$RET = SET_STRINGS_CHK("オブジェクト(ID)", $OBJECT_SET_ID);

			if($RET == $RET_OK)
			{
				last;
			}

			printf("\nオブジェクト(ID)を再入力してください。\n\n");
		}
		
		# オブジェクト(テクスチャー)設定
		while(1)
		{
			printf("オブジェクト(テクスチャー)を設定してください。 > ");
			$OBJECT_SET_TEXTURE = <STDIN>;
			$OBJECT_SET_TEXTURE = DEL_CLRF($OBJECT_SET_TEXTURE);

			$RET = SET_STRINGS_CHK("オブジェクト(テクスチャー)", $OBJECT_SET_TEXTURE);

			if($RET == $RET_OK)
			{
				last;
			}

			printf("\nオブジェクト(テクスチャー)を再入力してください。\n\n");
		}
		
		$RET = SET_OBJECT_PARAM_CHK( $OBJECT_SET_X, $OBJECT_SET_Y, 
										$OBJECT_SET_WIDTH, $OBJECT_SET_HEIGHT, $OBJECT_SET_ANGLE,
										$OBJECT_SET_ID, $OBJECT_SET_TEXTURE );
		if($RET == $RET_OK)
		{
			last;
		}

		printf("\nオブジェクト情報を再入力してください。\n\n");
	}
	
	return;
}

# --------------------------------------------------------
# 処理開始
# --------------------------------------------------------

# 引数チェック
if ($#ARGV != -1)
{
	USAGE();
	exit 0;
}

# ツール起動
printf("＜グラコロオブジェクト情報作成ツール開始＞\n");
printf("INFO : グラコロオブジェクト情報作成ツール起動開始！！\n\n");

printf("\n★☆------ オブジェクト情報ファイル名定義 -----☆★\n\n");
while(1)
{
	printf("オブジェクト情報ファイル名を入力してください。 > ");
	$OBJECT_SET_FILENAME = <STDIN>;
	$OBJECT_SET_FILENAME = DEL_CLRF($OBJECT_SET_FILENAME);

	$RET = SET_STRINGS_CHK("オブジェクト情報ファイル名", $OBJECT_SET_FILENAME);

	if($RET == $RET_OK)
	{
		last;
	}

	printf("\nオブジェクト情報ファイル名を再入力してください。\n\n");
}

printf("★☆------ オブジェクト情報定義 -----☆★\n\n");
MAKE_OBJECT_STR();

printf("\n★☆------ オブジェクト情報ファイル作成 -----☆★\n");
MAKE_OBJECT_FILE($FIRST_MAKE);


while(1)
{
	printf("\n★☆------ オブジェクト情報ファイル作成完了！！ -----☆★\n\n");

	printf("オブジェクト情報ファイルを作成しました。\nオブジェクトを追加する場合は y を入力してください。 > ");
	$CHK_PARAM = <STDIN>;

	if($CHK_PARAM =~ /^[yY]$/)
	{
		printf("\nオブジェクト情報を追記します。\n\n");

		printf("★☆------ オブジェクト情報定義 -----☆★\n\n");
		MAKE_OBJECT_STR();

		printf("\n★☆------ オブジェクト情報ファイル作成 -----☆★\n");
		MAKE_OBJECT_FILE($ADD_MAKE);

		next;
	}
	else
	{
		last;
	}
}

# ファイル終端行出力
open(FD, ">>$OBJECT_SET_FILENAME");
printf(FD "\n\]\n");
close(FD);


printf("INFO : グラコロフィールドマップ作成ツール終了！！\n\n");
printf("＜グラコロフィールドマップ作成ツール停止＞\n");
printf("-----------\n");

exit 0;
